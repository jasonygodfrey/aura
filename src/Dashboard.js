import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { getDownloadURL, ref } from 'firebase/storage'; // Import Storage methods
import { auth, db, storage } from './firebaseConfig'; // Import Firestore and Storage
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/create-profile');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'profiles', auth.currentUser.uid); // Reference to the user's profile document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const profileData = docSnap.data();

          // If there's a profile picture, fetch the download URL
          if (profileData.profilePicURL) {
            const profilePicRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
            profileData.profilePicURL = await getDownloadURL(profilePicRef); // Get the download URL for the image
          }

          setProfile(profileData); // Set profile data to state
        } else {
          console.log("No profile found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-content">
      <h2>Aura</h2>
      {/* Display the edit profile button even when loading */}
      <button onClick={handleEditProfile}>Edit Profile</button>

      {loading ? (
        <p>Loading profile...</p>
      ) : profile ? (
        <>
          <h2>Welcome, {profile.name}!</h2>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>Interests:</strong> {profile.interests}</p>
          <p><strong>Location:</strong> {profile.location}</p>
          {profile.profilePicURL && (
            <img
              src={profile.profilePicURL}
              alt="Profile"
              style={{ width: '150px', height: '150px', borderRadius: '50%' }}
            />
          )}
          <p><strong>Social Links:</strong> {profile.socialLinks}</p>
        </>
      ) : (
        <p>No profile data available</p>
      )}
    </div>
  );
}

export default Dashboard;
