const localStrategy = require("passport-local");
const { Medico, Patient, Administrator } = require("../../sequelize/sequelize");
const bcrypt = require('bcrypt')
function useLocalStrategy() {
    return new localStrategy(
        { usernameField: 'email', passReqToCallback: true },
        function (req, email, password, done) {
            const userType = req.body.userType
            let findIn = userType === "medic" ? Medico : userType === "pacient" ? Patient : Administrator;
            findIn.findOne({
                where: {
                    email: email
                }
            }).then(user => {
                if (user) {
                   
                    bcrypt.compare(password, user.password, function (err, isValid) {
                        if (isValid) {
                            
                            done(null, user)
                        } else {
                            done(`Contraseña incorrecta`)
                        }
                    })

                } else {
                    done("El Usuraio no existe")
                }
            })

        }
    )
}


module.exports = {
    useLocalStrategy
}