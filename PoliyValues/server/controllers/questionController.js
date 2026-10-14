import db from "../config/db.js";

const getRandomQuestion = async(req, res) => {

    //Get user    
    const id = req.user.id;

    try{
        //ask database for 1 random question not already answered by the user (we assume the attribute is_completed can't be NULL)
        const question_array = await db.query(
                            "SELECT * \
                            FROM questions \
                            LEFT JOIN user_question_status ON question.id = user_question_status.question_id \
                            WHERE ? = user_question_status.user_id AND user_question_status.is_completed = FALSE \
                            ORDER BY RAND() \
                            LIMIT 1", [id])

        // In case there is no more available questions    
        if (question_array.length === 0){ return res.send("You have answered every questions available for the moment")} 
        //Send the answer
        res.json(question_array[0])
    }

    //Keep the server from crashing if the database doesnt'answer
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
  }

}


export {getRandomQuestion}