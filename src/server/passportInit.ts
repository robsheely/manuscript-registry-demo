import { Strategy } from 'passport-local';
import * as passport from 'passport';
import * as argon2 from "argon2";
/* Session management with Passport */
import { User } from '../Users/User.entity';
import { SqlDatabase } from 'remult';
import { createPostgresDataProvider } from 'remult/postgres';

const passportInit = async (app) => {

    const dbProvider = await createPostgresDataProvider({
        connectionString: process.env.DATABASE_URL
    })
    const sql = SqlDatabase.getDb(dbProvider)

    passport.use('local',
        new Strategy(
            {
                // Passport uses "username" and "password", so we override with the names that we want those fields to have
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true, // allows us to pass back the entire request to the callback
            },

            /**
             * This is the Auth handler. We check for a valid user phone and authenticate if found
             */
            async function (_req, email, password, onDone) {
                console.log('passport')
                const SQL_STRING = `SELECT * FROM users WHERE email='${email}' LIMIT 1`;
                const result = await sql.execute(SQL_STRING)
                const user = result.rows[0]
                // Check for valid user
                if (!user) {
                    return onDone('Invalid credentials', false)
                }
                // Check for valid auth
                const passwordMatch = validatePassword(user, password)
                if (!passwordMatch) {
                    return onDone('Invalid credentials', false)
                }

                // All is well, return successful user
                return onDone(null, user)
            }
        )
    )

    passport.serializeUser((user: any, onDone: Callback) => {
        onDone(null, user.id);
    });

    passport.deserializeUser(async (id: string, onDone: Callback) => {
        const SQL_STRING = `SELECT * FROM users WHERE id='${id}' LIMIT 1`;
        const result = await sql.execute(SQL_STRING)
        const user = result.rows[0]
        onDone(null, user);
    });

    // Compare the password of an already fetched user (using `findUser`) and compare the
    // password for a potential match
    const validatePassword = async (user: User, inputPassword: string) => {
        try {
            const passwordsMatch = await argon2.verify(user.hash, inputPassword);
            return passwordsMatch;
        } catch (err) {
            // internal failure
        }

    }

    console.log('passportModule-3')

    app.use(passport.initialize())
    app.use(passport.session())
}

export default passportInit;
