import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase Storage for image upload
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firebase Firestore to store profile data
import { auth } from './firebaseConfig'; // Import Firebase authentication

function ProfileCreation() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // For profile picture
  const [socialLinks, setSocialLinks] = useState(''); // Social media links
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const storage = getStorage(); // Initialize Firebase storage
  const db = getFirestore(); // Initialize Firestore

  const handleImageUpload = async (file) => {
    if (!file) return;
    const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`); // Use user UID to store images
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !bio || !interests || !location || !socialLinks) {
      setError('All fields are required!');
      setSuccess('');
      return;
    }

    try {
      let profilePicURL = '';
      if (profilePicture) {
        profilePicURL = await handleImageUpload(profilePicture);
      }

      const profileData = {
        name,
        bio,
        interests,
        location,
        profilePicURL,
        socialLinks,
        userId: auth.currentUser.uid,
      };

      await setDoc(doc(db, 'profiles', auth.currentUser.uid), profileData);

      setSuccess('Profile created successfully!');
      setError('');
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('Failed to create profile');
    }
  };

  return (
    <div className="profile-content">
      <h2>Create Your Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="4"
          required
        />
        <input
          type="text"
          placeholder="Interests (e.g., gaming, music)"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Social Links (e.g., Discord, Instagram)"
          value={socialLinks}
          onChange={(e) => setSocialLinks(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}

export default ProfileCreation;
