import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}];
    try{
       const response=await mailtrapClient.send({
              from: sender,
              to: recipient,
              subject: "Email Verification",
              html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
              Category: "verification Email",
         });
         console.log("Email sent successfully:", response);
    }
    catch(error){
        console.error("Error sending email:", error);
        throw new Error("Failed to send verification email");
    }
};
export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];
    try{
       const response=await mailtrapClient.send({
        from: sender,
        to: recipient,
        template_uuid:"9eb51c22-9a0c-45df-b457-41977c786e9d"
    });
    console.log("Welcome email sent successfully:", response);
}
    catch(error){
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }
};