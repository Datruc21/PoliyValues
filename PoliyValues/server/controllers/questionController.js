import db from "../config/db.js";

const getRandomQuestion = async(req, res) => {

    //Get user    
    const id = req.user.id;

    try{
        //ask database for 1 random question not already answered by the user (we assume the attribute is_completed can't be NULL)
        const [questions] = await db.query(
                            "SELECT q.* \
                            FROM questions q\
                            LEFT JOIN user_question_status uqs \
                                ON q.id = uqs.question_id AND uqs.user_id = ?\
                            WHERE (uqs.is_completed = FALSE OR uqs.is_completed IS NULL)\
                            ORDER BY RAND() \
                            LIMIT 1", [id])  //[userId] ??

        // In case there is no more available questions    
        if (questions.length === 0){ return res.send("You have answered every questions available for the moment")} 
        //Send the answer
        res.json(questions[0])
    }

    //Keep the server from crashing if the database doesnt'answer
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
  }

}

const submitAnswer = async(req, res) => {
    const userId = req.user.id;

    const {questionId, opinionValue} = req.body;

    //Vérification de sécurité de base
    if (!questionId || opinionValue === undefined) {
        return res.status(400).json({ error: "questionId et opinionValue sont requis" });
    }
    if (opinionValue < -2 || opinionValue > 2) {
        return res.status(400).json({ error: "La valeur de l'opinion doit être entre -2 et 2" });
    }

    try{
        await db.query("INSERT INTO user_question_status \
            Values (?, ?, TRUE, ? ,CURRENT_TIMESTAMP)\
            ON DUPLICATE KEY (user_id, question_id, is_completed, opinion_value, answered_at)",
            [userId, questionId, opinionValue]);
        res.status(200).json({ message: "Réponse enregistrée avec succès !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({error : "Erreur lors de l'enregistrement de la réponse"});
    }

}


const toggleFavorite = async(req, res) => {

    const userId = req.user.id;
    const questId = req.body.questId;

    try {

        const query = "INSERT INTO user_question_status (user_id, question_id, is_favorite)\
                    VALUES (?, ?, TRUE) \
                    ON DUPLICATE KEY UPDATE is_favorite = NOT is_favorite";
        
        await db.query(query, [userId, questId]);
    res.status(200).json({ message: "Favorite registered with success !" });
    } catch (err) {
        console.error(err);
        res.status(500).json({error : "Error during favorite registering"});
    }


}


export {getRandomQuestion, submitAnswer, toggleFavorite}