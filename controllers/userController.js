// controllers/userController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const crypto = require('crypto');
const Creator = require('../models/Creator'); // Import Creator if needed
const Createur = require('../models/Createur'); // Import Creator if needed
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Render Signup Page
exports.getSignup = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/account');
  }
  res.render('signup');
};
exports.getSignupCreateur = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/account-createur');
  }
  res.render('signup-createur');
};

// Handle Signup
exports.postSignup = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const companyName = req.body.companyName;
    const password = req.body.password;
    const name = req.body.name;
    const surname = req.body.surname;
    const phoneNumber = req.body.number;
    // const confirmPassword = req.body.confirmPassword;

    const receiveMarketing = req.body.receivemarketing === 'on';

    // Check if passwords match
    //if (password !== confirmPassword) {
      //req.flash('error', 'Les mots de passe sont différents.');
      //return res.redirect('/signup');
    //}
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Check if the email already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      req.flash('error', 'Un compte avec cet e-mail existe déjà. Veuillez vous connecter ou utiliser un autre e-mail.');
      return res.redirect('/signup');
    }

    const newUser = new User({
      email: email,
      companyName: companyName,
      password: hashedPassword,
      name: name,          // <--- store first name
      surname: surname,    // <--- store last name
      number: phoneNumber,
      receivemarketing: receiveMarketing,
    });

    const savedUser = await newUser.save();
    
    
    // try {
    //   const msg = {
    //     to: email,
    //     from: 'contact@scalevision.fr',
    //     templateId: 'd-de0daf39888d4a689abaf6ea32f99c12',
        
    //   };
    //   await sgMail.send(msg);
    //   console.log('Email sent');
    // } catch (err) {
    //   console.error('Erreur lors de l\'envoi de l\'email :', err);
    //   req.flash('error', 'Une erreur est survenue lors de l\'envoi de l\'email. Veuillez réessayer.');
    // }
    // try {
    //   const msg = {
    //     to: email,
    //     from: 'contact@scalevision.fr',
    //     templateId: 'd-255935cfaa014329a5055036f4a2ffe4',
        
    //   };
    //   await sgMail.send(msg);
    //   console.log('Email sent');
    // } catch (err) {
    //   console.error('Erreur lors de l\'envoi de l\'email :', err);
    //   req.flash('error', 'Une erreur est survenue lors de l\'envoi 2 de l\'email. Veuillez réessayer.');
    // }

    // Authenticate the user after successful signup
    req.logIn({savedUser}, function (err) {
      if (err) {
        req.flash('error', 'Une erreur est survenue lors de la connexion.');
        return res.redirect('/');
      }
      return res.redirect('/creators');
    });
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    req.flash('error', 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    res.redirect('/signup');
  }
};

// Handle Signup Createur
exports.postSignupCreateur = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const pseudo = req.body.pseudo;
    const password = req.body.password;
    // const confirmPassword = req.body.confirmPassword;

    // Check if passwords match
    //if (password !== confirmPassword) {
      //req.flash('error', 'Les mots de passe sont différents.');
      //return res.redirect('/signup');
    //}
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // Check if the email already exists
    const existingCreateur = await Createur.findOne({ email: email });
    if (existingCreateur) {
      req.flash('error', 'Un compte avec cet e-mail existe déjà. Veuillez vous connecter ou utiliser un autre e-mail.');
      return res.redirect('/signup-createur');
    }

    const newCreateur = new Createur({
      email: email,
      pseudo: pseudo,
      password: hashedPassword,
    });

    const savedCreateur = await newCreateur.save();
    
    
    // try {
    //   const msg = {
    //     to: email,
    //     from: 'contact@scalevision.fr',
    //     templateId: 'd-de0daf39888d4a689abaf6ea32f99c12',
        
    //   };
    //   await sgMail.send(msg);
    //   console.log('Email sent');
    // } catch (err) {
    //   console.error('Erreur lors de l\'envoi de l\'email :', err);
    //   req.flash('error', 'Une erreur est survenue lors de l\'envoi de l\'email. Veuillez réessayer.');
    // }
    // try {
    //   const msg = {
    //     to: email,
    //     from: 'contact@scalevision.fr',
    //     templateId: 'd-255935cfaa014329a5055036f4a2ffe4',
        
    //   };
    //   await sgMail.send(msg);
    //   console.log('Email sent');
    // } catch (err) {
    //   console.error('Erreur lors de l\'envoi de l\'email :', err);
    //   req.flash('error', 'Une erreur est survenue lors de l\'envoi 2 de l\'email. Veuillez réessayer.');
    // }

    // Authenticate the user after successful signup
    req.logIn(savedCreateur, function (err) {
      if (err) {
        req.flash('error', 'Une erreur est survenue lors de la connexion.');
        return res.redirect('/');
      }
      return res.redirect('/account-createur');
    });
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    req.flash('error', 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    res.redirect('/signup');
  }
};

// Set Password
exports.setPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.send('Passwords do not match.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password in the database
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });
    console.log('Password updated for user:', req.user._id);

    
    req.flash('success', 'Votre mot de passe a bien été changé !');
    
    res.redirect('/account');
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    req.flash('error', 'Une erreur est survenue lors de votre changement de mot de passe. Veuillez réessayer.');
    res.redirect('/account');
    
  }
};

// Render Account Page
exports.getAccount = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user.email) {
      // Redirect to the campaign details form if user info is incomplete
        return res.redirect('/creators');
      }
      // // Find all campaigns for the logged-in user and populate the creator names
      // const campaigns = await Campaign.find({ userId: req.user._id })
      //   .populate('creatorIds', 'name profileImage'); // Populate creators' names
  
      
  
      // // Map campaigns to include the creators' names and count of creators
      // const campaignsWithCreators = campaigns.map((campaign) => {
      //   let creators = [];
      //   if (Array.isArray(campaign.creatorIds)) {
      //     // campaign.creatorIds is an array
      //     creators = campaign.creatorIds.map((creator) => ({
      //       name : creator.name, 
      //       photo : creator.profileImage
      //     }));

      //   } else if (campaign.creatorIds) {
      //     // campaign.creatorIds is a single object
      //     creators = [{
      //       name: campaign.creatorIds.name,
      //       photo: campaign.creatorIds.profileImage,
      //     }];
      //   } else {
      //     // campaign.creatorIds is undefined or null
      //     creators = [];
      //   }
  
      //   const creatorCount = creators.length;
  
      //   return {
      //     creators,
      //     creatorCount,
      //     budget: campaign.budget,
      //     date: campaign.date ? campaign.date.toDateString() : 'N/A',
      //     status: campaign.status,
      //   };
      // });
      
  
      // Render the account page with the campaigns and the user info
      //res.render('account', { campaigns: campaignsWithCreators, user: req.user });
      res.render('account', {user: req.user || null });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching campaigns.');
    }
  };


  // Render Account Createur Page
exports.getAccountCreateur = async (req, res) => {
    try {
      const createur = await Createur.findById(req.user._id);
      if (!createur.pseudo || !createur.email) {
      // Redirect to the campaign details form if user info is incomplete
        return res.redirect('/creators');
      }
      // Find all campaigns for the logged-in user and populate the creator names
      // const campaigns = await Campaign.find({ userId: req.createur._id })
      //   .populate('creatorIds', 'name profileImage'); // Populate creators' names
  
      
  
      // // Map campaigns to include the creators' names and count of creators
      // const campaignsWithCreators = campaigns.map((campaign) => {
      //   let creators = [];
      //   if (Array.isArray(campaign.creatorIds)) {
      //     // campaign.creatorIds is an array
      //     creators = campaign.creatorIds.map((creator) => ({
      //       name : creator.name, 
      //       photo : creator.profileImage
      //     }));

      //   } else if (campaign.creatorIds) {
      //     // campaign.creatorIds is a single object
      //     creators = [{
      //       name: campaign.creatorIds.name,
      //       photo: campaign.creatorIds.profileImage,
      //     }];
      //   } else {
      //     // campaign.creatorIds is undefined or null
      //     creators = [];
      //   }
  
      //   const creatorCount = creators.length;
  
      //   return {
      //     creators,
      //     creatorCount,
      //     budget: campaign.budget,
      //     date: campaign.date ? campaign.date.toDateString() : 'N/A',
      //     status: campaign.status,
      //   };
      // });
      
  
      // Render the account page with the campaigns and the user info
      res.render('account-createur', { createur: req.createur,user: req.user || null });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching campaigns.');
    }
  };

  // Render Forgot Password Page
exports.getForgotPassword = (req, res) => {
  res.render('forgot');
};

// Handle Forgot Password Form Submission
exports.postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Createur.findOne({ email: email });
    if (!user) {
      req.flash('error', 'Aucun compte trouvé avec cet e-mail.');
      return res.redirect('/forgot');
    }

    // Generate reset token
    const token = crypto.randomBytes(20).toString('hex');

    // Set token and expiration on user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);


    const resetURL = `${process.env.BASE_URL}/reset/${token}`;

    // Send the email
    const msg = {
      to: user.email,
      from: 'contact@leboncreateur.com',
      subject: '[Leboncréateur] - Réinitialisation du mot de passe',
      text: `Vous recevez cet email parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n
      Veuillez cliquer sur le lien suivant, ou copiez-le dans votre navigateur pour compléter le processus dans l'heure qui suit:\n\n
      ${resetURL}\n\n
      Si vous n'avez pas demandé ceci, veuillez ignorer cet email et votre mot de passe restera inchangé.\n`
  };

  await sgMail.send(msg);

    req.flash('success', 'Un email vous a été envoyé avec les instructions pour réinitialiser votre mot de passe.');
    res.redirect('/forgot');
  } catch (err) {
    console.error('Erreur lors de la demande de réinitialisation du mot de passe:', err);
    req.flash('error', 'Une erreur est survenue, veuillez réessayer plus tard.');
    res.redirect('/forgot');
  }
};

// Render Reset Password Page
exports.getResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await Createur.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      req.flash('error', 'Le lien de réinitialisation du mot de passe est invalide ou a expiré.');
      return res.redirect('/forgot');
    }
    res.render('reset', { token });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Une erreur est survenue.');
    res.redirect('/forgot');
  }
};

// Handle Reset Password Form Submission
exports.postResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      req.flash('error', 'Les mots de passe ne correspondent pas.');
      return res.redirect('back');
    }

    const user = await Createur.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Le lien de réinitialisation du mot de passe est invalide ou a expiré.');
      return res.redirect('/forgot');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash('success', 'Votre mot de passe a été réinitialisé avec succès! Vous pouvez maintenant vous connecter.');
    res.redirect('/login');
  } catch (err) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', err);
    req.flash('error', 'Une erreur est survenue. Veuillez réessayer.');
    res.redirect('/forgot');
  }
};

exports.likeCreators= async (req, res) => {
  try {
    
    if (!req.user || !req.user._id || req.user.type !== 'user' ) {
      req.flash('error', 'Vous devez être connecté pour ajouter un créateur à vos favoris.');
      return res.redirect('/login');  // Redirect to login
    }
    const creatorId = req.params.creatorId;
    const user = await User.findById(req.user._id);

    // Check if the creatorId is already in the user's likedCreators
    if (!user.likedCreators.includes(creatorId)) {
      user.likedCreators.push(creatorId);
      await user.save();
      req.flash('success', 'Créateur ajouté à vos favoris.');
    } else {
      req.flash('info', 'Ce créateur est déjà dans vos favoris.');
    }

    res.redirect('/creators'); // or wherever you want to redirect
  } catch (err) {
    console.error('Error liking creator:', err);
    req.flash('error', 'Impossible d\'ajouter le créateur à vos favoris.');
    res.redirect('/creators');
  }
};

exports.unlikeCreators= async (req, res) => {
  try {
    const creatorId = req.params.creatorId;
    const user = await User.findById(req.user._id);

    if (!user) {
      req.flash('error', 'Utilisateur introuvable.');
      return res.redirect('/creators');
    }

    // remove the creator from the array if present
    user.likedCreators = user.likedCreators.filter(
      (id) => id.toString() !== creatorId
    );
    await user.save();

    req.flash('success', 'Créateur retiré de vos favoris.');
    res.redirect('/creators');
  } catch (err) {
    console.error('Error unliking creator:', err);
    req.flash('error', 'Impossible de retirer ce créateur de vos favoris.');
    res.redirect('/creators');
  }
};

exports.getLikedCreators = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('likedCreators'); // populates the full Creator docs

    if (!user) {
      req.flash('error', 'Utilisateur introuvable.');
      return res.redirect('/');
    }

    // user.likedCreators now contains an array of Creator documents
    res.render('likedCreators', { likedCreators: user.likedCreators });
  } catch (err) {
    console.error('Error fetching liked creators:', err);
    req.flash('error', 'Impossible de récupérer vos créateurs favoris.');
    res.redirect('/');
  }
};