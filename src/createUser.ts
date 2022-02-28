import {Request , Response } from 'firebase-functions';
import {initializeApp , auth } from 'firebase-admin';

initializeApp();

export const createUserHandler = async (
    request:Request,
    response:Response
    ) => {

        try {
            // logger.log(response.body);
            const {email, password , name} = request.body.input.credentials;
            const user = await auth().createUser({
                email,
                password,
                displayName:name
            })

            await auth().setCustomUserClaims(user.uid, {
                "https://hasura.io/jwt/claims":{
                    "x-husara-allowed-roles": ["user"],
                    "x-hasura-default-role": "user",
                    "x-husara-user-id": user.uid,
                }
            }) 
            response.status(200).send({
                id: user.uid,
                email: user.email,
                name: user.displayName     
            }) 
        } catch (error) {
            response.status(500).send({ message : `message ${error.message}`});
        }
         
}