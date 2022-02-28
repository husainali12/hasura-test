import {Request , Response } from 'firebase-functions';
import { auth } from 'firebase-admin';


export const getProfileHandler = async (
    request:Request,
    response:Response
    ) => {

        try {
            // logger.log(response.body);
            const {id} = request.body.input;
            const {uid , email , displayName} = await auth().getUser(id)

            response.status(200).send({
                id: uid,
                email: email,
                displayName: displayName     
            }) 
        } catch (error) {
            response.status(500).send({ message : `message ${error.message}`});
        }
        
}