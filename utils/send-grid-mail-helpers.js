const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



const sendGrindMessageVerification = async (emailToInvite, linkVerification, verificationCode, res ) => {

    const MessageSendGridVerification = {
        to: emailToInvite,
        from: 'emmanuil.hajrutdinov@incode-it.com', // Use the email address or domain you verified above
        subject: 'Verification Email',
        text: `Hello. We noticed that you have not yet verified your sender identity. 
        To verify your sender identity, follow the link and enter the verification code`,
        html: `
        <div>
            <p style="font-size: 18px; font-family: 'Noto Sans JP', sans-serif"  >
                Hello. We noticed that you have not yet verified your sender identity. 
                To verify your sender identity, follow the link and enter the verification code 
            </p>
            <a href="${linkVerification}" style="display: block; font-size: 18px" >${linkVerification}</a> 
            <p style="dispaly: block; font-size: 18px" >Code verification ${verificationCode}</p>
        </div>`,
    };

    return ( async () => {
        try {
            await sgMail.send(MessageSendGridVerification);

            return true;
        } catch (error) {
    
            const displayError = error?.response?.body?.errors || error;

            console.dir(displayError);
            res.status(404).send(displayError);

            return false;
        }
    })();
}

const sendGrindMessageRemindPassword = ({ emailToInvite, linkRemindPassword, remindPaswordCode, res }) => {

    const MessageSendGridRamindPassword = {
        to: emailToInvite,
        from: 'emmanuil.hajrutdinov@incode-it.com', // Use the email address or domain you verified above
        subject: 'Verification Email',
        text: `Hello. We noticed that you want to reset your password to log into your account. 
                To confirm that you are a user of your account, follow the link and enter the 
                verification code.`,
        html: `
        <div>
            <p style="font-size: 18px; font-family: 'Noto Sans JP', sans-serif"  >
                Hello. We noticed that you want to reset your password to log into your account. 
                To confirm that you are a user of your account, follow the link and enter the 
                verification code.
            </p>
            <a href="${linkRemindPassword}" style="display: block; font-size: 18px" >${linkRemindPassword}</a> 
            <p style="dispaly: block; font-size: 18px" >Code: ${remindPaswordCode}</p>
        </div>`,
    };

    return ( async () => {
        try {
            await sgMail.send(MessageSendGridRamindPassword);

            return true;
        } catch (error) {
    
            const displayError = error?.response?.body?.errors || error;

            console.dir(displayError);
            res.status(404).send(displayError);

            return false;
        }
    })();
}

module.exports = {
    sendGrindMessageVerification,
    sendGrindMessageRemindPassword
}