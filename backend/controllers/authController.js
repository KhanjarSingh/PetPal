const { db, admin } = require("../firebase/firebase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const userData = userDoc.data();
    // Do not send password hash
    const { password, ...safeUser } = userData;
    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { uid: user.uid, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, error: "Email, password, and name required" });
    }

    const existingUser = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!existingUser.empty) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = `email_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const user = {
      uid,
      email,
      name,
      password: hashedPassword,
      authProvider: "email",
      createdAt: admin.firestore.Timestamp.now(),
    };

    await db.collection("users").doc(uid).set(user);
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: { uid, email, name },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password required" });
    }

    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (userSnapshot.empty) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const userData = userSnapshot.docs[0].data();
    const isValidPassword = await bcrypt.compare(password, userData.password);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = generateToken(userData);

    res.json({
      success: true,
      token,
      user: { uid: userData.uid, email: userData.email, name: userData.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const verifyGoogleToken = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res
        .status(400)
        .json({ success: false, error: "ID token required" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const userRef = db.collection("users").doc(decodedToken.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email,
        authProvider: "google",
        createdAt: admin.firestore.Timestamp.now(),
      });
    }

    // Generate our own JWT for the user, just like in loginUser
    const userForToken = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email,
    };
    const token = generateToken(userForToken);

    res.json({
      success: true,
      token, // Return the JWT
      user: userForToken,
    });
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyGoogleToken,
  getProfile,
};
