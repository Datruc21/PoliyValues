import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import db from "../config/db.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Générer un code à 6 chiffres et une expiration à +10 minutes
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);
    console.log("👉 DEBUG - Code généré pour :", email, "Code :", verificationCode);
    // Insérer l'utilisateur avec isVerified = 0 et le token de vérification
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, isVerified, verificationToken, verificationTokenExpires) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashPassword, 0, verificationCode, codeExpires],
    );
    console.log("👉 DEBUG - Utilisateur inséré en BDD avec l'ID :", result.insertId);
    // Envoyer l'e-mail de vérification
    console.log("👉 DEBUG - Tentative d'envoi du mail via Nodemailer...");
    await sendVerificationEmail(email, verificationCode);
    console.log("👉 DEBUG - Mail envoyé avec succès !");

    res.status(201).json({
      status: "success",
      message: "Compte créé ! Veuillez vérifier votre e-mail pour entrer le code de validation.",
      data: {
        email: email,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email et code requis" });
  }

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const user = users[0];

    if (user.isVerified) {
      return res.status(400).json({ error: "Ce compte est déjà vérifié" });
    }

    if (user.verificationToken !== code || new Date() > new Date(user.verificationTokenExpires)) {
      return res.status(400).json({ error: "Code invalide ou expiré" });
    }

    // Mettre à jour le statut et nettoyer les tokens
    await db.query(
      "UPDATE users SET isVerified = TRUE, verificationToken = NULL, verificationTokenExpires = NULL WHERE id = ?",
      [user.id],
    );

    res.status(200).json({
      status: "success",
      message: "E-mail vérifié avec succès ! Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    console.error("Erreur lors de la vérification :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    // 1. Vérifier si l'utilisateur existe (tableau vide = aucun utilisateur trouvé)
    if (existingUsers.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // On extrait l'utilisateur du tableau
    const user = existingUsers[0];

    const passwdValid = await bcrypt.compare(password, user.password);
    if (!passwdValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (user.isBanned === 1 || user.isBanned === true) {
      return res.status(403).json({
        error: "Your account has been banned",
      });
    }

    // 3 generer le token
    const token = generateToken(user.id, user.Admin, res);

    res.status(200).json({
      status: "success",
      message: "User successfully logged in",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          Admin: user.Admin === 1,
        },
      },
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: "success",
    message: "User successfully logged out",
  });
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // Requête SQL pour récupérer l'utilisateur par son ID
    const [users] = await db.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [
      userId,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const user = users[0];

    res.json({
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const currentUser = users[0];

    let updatedName = currentUser.name;
    let updatedEmail = currentUser.email;

    if (name && name.trim() !== "" && name !== currentUser.name) {
      const [nameTaken] = await db.query("SELECT id FROM users WHERE name = ? AND id != ?", [
        name,
        userId,
      ]);
      if (nameTaken.length > 0) {
        return res.status(400).json({ error: "Username already in use" });
      }
      updatedName = name.trim();
    }

    if (email && email.trim() !== "" && email !== currentUser.email) {
      const [emailTaken] = await db.query("SELECT id FROM users WHERE email = ? AND id != ?", [
        email,
        userId,
      ]);
      if (emailTaken.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }
      updatedEmail = email.trim();
    }

    // 4. Mettre à jour en base de données
    await db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      updatedName,
      updatedEmail,
      userId,
    ]);

    res.json({
      message: "Profile updated successfully",
      data: {
        name: updatedName,
        email: updatedEmail,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

const deleteMe = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query("DELETE FROM users WHERE id = ?", [userId]);

    // Penser à supprimer aussi le cookie côté client ou l'expirer
    res.clearCookie("jwt");
    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // 1. Récupérer l'utilisateur
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = users[0];

    // 2. Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // 3. Validation basique du nouveau mot de passe
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // 4. Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Mettre à jour en BDD
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: "No Google token provided" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    let user;

    if (users.length === 0) {
      const dummyPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dummyPassword, salt);

      const [result] = await db.query(
        "INSERT INTO users (name, email, password, Admin) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, 0],
      );
      user = { id: result.insertId, name, email, Admin: 0 };
    } else {
      user = users[0];
      if (user.isBanned === 1 || user.isBanned === true) {
        return res.status(403).json({ error: "Your account has been banned" });
      }
    }

    const token = generateToken(user.id, user.Admin, res);

    res.status(200).json({
      status: "success",
      message: "Google authentication successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          Admin: user.Admin === 1,
        },
      },
      token: token,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ error: "Google authentication failed" });
  }
};

const resendVerificationCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return status(400).json({ error: "Email is required" });

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return status(404).json({ error: "User not found" });

    const user = users[0];
    if (user.isVerified) return status(400).json({ error: "Account is already verified" });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      "UPDATE users SET verificationToken = ?, verificationTokenExpires = ? WHERE id = ?",
      [verificationCode, codeExpires, user.id],
    );

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ status: "success", message: "New verification code sent!" });
  } catch (error) {
    console.error("Resend code error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export {
  register,
  verifyEmail,
  login,
  logout,
  getMe,
  resendVerificationCode,
  updateMe,
  deleteMe,
  changePassword,
  googleLogin,
};
