import nodemailer from 'nodemailer';

export const sinUpEmail = async (datos) => {
    const { name, email, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // info del email

    const infoEmail = {
        from: '"UpTask - Project Manager" <cuentas@uptask.com>',
        to: email,
        subject: "Project Manager Recovery Password",
        text: "validate your uptask account please",
        html: `
            <p> Hola: ${name} valida tu cuenta en upTask</p>
            <p>Valida tu cuenta dando click en el enlace:</p>

            <a href="${process.env.FRONTEND_URL}/confirm-account/${token}" >Validar Cuenta Aquí</a>

            <p>Si no creaste esta cuenta por favor ignora este mensaje.</p>
        `
    };

    await transport.sendMail(infoEmail)

};

///////////////////////////////////Para  Cambair de Contraseña  /////////////////////////////////

export const changePassword = async (datos) => {
    const { name, email, token } = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // info del email

    const infoEmail = {
        from: '"UpTask - Project Manager" <cuentas@uptask.com>',
        to: email,
        subject: "Reestablece tu password",
        text: "Reestablece tu password",
        html: `
            <p> Hola: ${name} reestablece el password  de tu cuenta en upTask</p>
            <p>Reestablece tu password dando click en el enlace:</p>

            <a href="${process.env.FRONTEND_URL}/recovery-password/${token}" >Reestablece tu password Aquí</a>

            <p>Si no solicitaste el cambio por favor ignora este mensaje.</p>
        `
    };

    await transport.sendMail(infoEmail)

};