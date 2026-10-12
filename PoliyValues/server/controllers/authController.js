import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import db from "../config/db.js";

const register = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    // 1. Vérifier si l'utilisateur existe déjà
    // On utilise [rows] pour récupérer directement les résultats de la requête
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // 2. Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // 3. Créer l'utilisateur dans la base de données
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashPassword, false],
    );

    // MySQL renvoie un objet 'result' qui contient l'ID de la ligne qu'on vient d'insérer (insertId)
    const userId = result.insertId;
    const user = { id: userId, name, email };

    console.log("User created:", user);

    // 4. Générer le token
    const token = generateToken(user.id, user.Admin, res);

    console.log("Token generated:", token);

    res.status(201).json({
      status: "success",
      message: "User profile created successfully",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      token: token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    // 1. Vérifier si l'utilisateur existe (tableau vide = aucun utilisateur trouvé)
    if (existingUsers.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // On extrait l'utilisateur du tableau
    const user = existingUsers[0];

    // 2. Vérifier le mot de passe
    const passwdValid = await bcrypt.compare(password, user.password);
    if (!passwdValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3 generer le token
    const token = generateToken(user.id, user.Admin, res);

    // 4. Réponse de succès (code 200)
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
    const [users] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [userId],
    );

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

    // Vérifier si l'email est déjà pris par un autre utilisateur
    if (email) {
      const [emailTaken] = await db.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, userId],
      );

      if (emailTaken.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Vérifier si le nom est déjà pris par un autre utilisateur
    if (name) {
      const [nameTaken] = await db.query(
        "SELECT id FROM users WHERE name = ? AND id != ?",
        [name, userId],
      );

      if (nameTaken.length > 0) {
        return res.status(400).json({ error: "Username already in use" });
      }
    }

    // Mise à jour dynamique selon ce qui est fourni
    // On récupère d'abord l'utilisateur actuel pour ne pas écraser les champs non fournis
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    const currentUser = users[0];

    const updatedName = name || currentUser.name;
    const updatedEmail = email || currentUser.email;

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
    console.error(err);
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
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
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
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export { register, login, logout, getMe, updateMe, deleteMe, changePassword };
