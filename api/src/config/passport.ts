import passport from "passport";
import { PrismaClient } from "@prisma/client";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.CALLBACK_URL}/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let checkUser = await prisma.learnerUser.findUnique({
          where: { email: profile.emails?.[0].value ?? "", NOT: { provider: "google" } },
        });

        if (checkUser) {
          return done(null, false, { message: "Email already exists" });
        }

        let user = await prisma.learnerUser.findUnique({
          where: { providerId: profile.id },
        });

        if (!user) {
          const totolUser = await prisma.learnerUser.count();
          user = await prisma.learnerUser.create({
            data: {
              provider: "google",
              providerId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0].value ?? "",
              userNo: totolUser + 1,
              profile: {
                create: {},
              },
            },
          });
          // console.log("profile===>", JSON.stringify(profile));
        }
        done(null, user);
      } catch (error) {
        return done(null, false, { message: "login failed" });
      }
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: `${process.env.CALLBACK_URL}/facebook/callback`,
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let checkUser = await prisma.learnerUser.findUnique({
          where: { email: profile.emails?.[0].value ?? "", NOT: { provider: "facebook" } },
        });

        if (checkUser) {
          return done(null, false, { message: "Email already exists" });
        }

        let user = await prisma.learnerUser.findUnique({
          where: { providerId: profile.id },
        });

        if (!user) {
          const totolUser = await prisma.learnerUser.count();
          user = await prisma.learnerUser.create({
            data: {
              provider: "facebook",
              providerId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0].value ?? "",
              userNo: totolUser + 1,
              profile: {
                create: {},
              },
            },
          });
          // console.log("profile===>", JSON.stringify(profile));
        }
        done(null, user);
      } catch (error) {
        return done(null, false, { message: "login failed" });
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
