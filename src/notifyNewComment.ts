import { Request, Response } from "firebase-functions";
import fetch from 'node-fetch';
import { createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";


const GET_POST_QUERY = `query getPost($id: integer!) {
    posts_by_pk(id: $id) {
      id
      image
      title
    }
  }`;
export const notifyNewCommentHandler =  async (
    request: Request,
    response: Response
) => {

    try {

        const { event } = request.body
        const { post_id , comment } = event?.data?.new;
        const { session_variable } = event;

        const postInfoQuery = await fetch('http://localhost:8080/v1/graphql',{
            method:"Post",
            body: JSON.stringify({
                query: GET_POST_QUERY,
                variables: { id: post_id },
            }),
            headers:{ ...session_variable , ...request.headers }
        });
    // logger.log(await postInfoQuery.json());

    
    const {title , image} = await postInfoQuery.json()?.data?.posts_by_pk;

    const testAccount = await createTestAccount();
    const transporter = createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const sentEmail = await transporter.sendMail({
      from: `"Firebase Function" <${testAccount.user}>`,
      to: "husainali.4883@gmail.com",
      subject: "New Comment to the photo",
      html: `
        <html>
          <head></head>
          <body>
            <h1>Hi there!</h1>
            <br> <br>
            <p>You have got a new comment to your photo: <a href="${image}">${title}</a> </p>
            <p>The comment text is: <i>${comment}</i></p>
          </body>
        </html>     
    `,
    });

    // logger.log(getTestMessageUrl(sentEmail));

    response.status(200).send({ message: "success" })


        
    } catch (error) {
        response.status(500).send({ message: `Message: ${error.message}` });
    }


};