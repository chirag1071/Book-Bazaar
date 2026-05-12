import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BookCard from '../../Components/BookCard/BookCard';
import api from '../../utils/api';
import './ProfilePage.css';

function ProfilePage({ user: authUser, wishlist = [], toggleWishlist }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'info';
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // Form State
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [updateMsg, setUpdateMsg] = useState('');
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdMsg, setPwdMsg] = useState('');

  useEffect(() => {
    const fetchProfileAndBooks = async () => {
      try {
        const [profileData, booksData] = await Promise.all([
          api.get('/api/v1/user/profile'),
          api.get('/api/book/all')
        ]);
        setProfile(profileData);
        setFormData({ name: profileData.name || '', email: profileData.email || '' });
        setAllBooks(booksData.books || []);
      } catch (err) {
        console.error("Failed to load profile or books", err);
      } finally {
        setLoading(false);
      }
    };
    if (authUser) fetchProfileAndBooks();
  }, [authUser]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMsg('Updating...');
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (selectedFile) {
        data.append('image', selectedFile);
      }

      const res = await api.put('/api/v1/user/updateprofile', data, true);
      
      // Re-fetch profile to get new image URL
      const updatedProfile = await api.get('/api/v1/user/profile');
      setProfile(updatedProfile);
      
      setIsEditing(false);
      setUpdateMsg('Profile updated successfully!');
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setUpdateMsg('Failed to update profile.');
    }
  };

  const handleReadNow = (bookTitle) => {
    const book = allBooks.find(b => b.title === bookTitle);
    if (book) {
      navigate(`/book/${book._id}`);
    } else {
      alert(`${bookTitle} was not found in the database. Please make sure the backend is seeded with this book.`);
    }
  };

  if (!authUser) {
    return (
      <div className="profile-page" style={{padding: '150px 20px', textAlign: 'center'}}>
        <h2>Please log in to view your profile.</h2>
      </div>
    );
  }

  if (loading) {
    return <div className="profile-page" style={{padding: '150px'}}><div className="loader">Loading...</div></div>;
  }

  const tabs = [
    { id: 'info', icon: '👤', label: 'Profile Info' },
    { id: 'orders', icon: '📦', label: 'My Orders' },
    { id: 'wishlist', icon: '❤️', label: 'Wishlist' },
    { id: 'library', icon: '📚', label: 'My Library' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="container">
          <h1>My Profile</h1>
        </div>
      </div>

      <div className="container">
        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-card">
              {profile?.image ? (
                <img src={profile.image} alt={profile.name} className="profile-avatar-custom" style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 15px', display: 'block'}} />
              ) : (
                <div className="profile-avatar-lg">👤</div>
              )}
              <h3>{profile?.name || 'User'}</h3>
              <p className="profile-email-text">{profile?.email}</p>
              
              {!isEditing ? (
                <button className="btn-primary" style={{width: '100%', marginTop: '10px'}} onClick={() => { setIsEditing(true); handleTabChange('info'); }}>Edit Profile</button>
              ) : (
                <button className="btn-secondary" style={{width: '100%', marginTop: '10px'}} onClick={() => setIsEditing(false)}>Cancel Edit</button>
              )}
              {updateMsg && <p style={{color: 'var(--primary)', marginTop: '10px', fontSize: '0.9rem'}}>{updateMsg}</p>}
            </div>
            
            <nav className="profile-nav">
              {tabs.map((item) => (
                <button 
                  key={item.id} 
                  className={`profile-nav-link ${currentTab === item.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(item.id)}
                  style={{width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit'}}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="profile-main">
            {currentTab === 'info' && (
              <>
                <div className="profile-section-header">
                  <h2>Profile Information</h2>
                </div>

                {isEditing ? (
                  <div className="profile-info-card update-form-card">
                    <h3>Update Details</h3>
                    <form onSubmit={handleUpdateProfile} style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px'}}>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input" required />
                      </div>
                      <div className="form-group">
                        <label>Profile Picture</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" style={{padding: '10px 0'}} />
                      </div>
                      <button type="submit" className="btn-primary">Save Changes</button>
                    </form>
                  </div>
                ) : (
                  <div className="profile-info-card">
                    <h3>Personal Details</h3>
                    <div className="info-grid">
                      <div className="info-field">
                        <label>Full Name</label>
                        <p>{profile?.name}</p>
                      </div>
                      <div className="info-field">
                        <label>Email</label>
                        <p>{profile?.email}</p>
                      </div>
                      <div className="info-field">
                        <label>Member ID</label>
                        <p>{profile?._id?.substring(0, 8).toUpperCase() || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {currentTab === 'orders' && (
               <div className="profile-info-card">
                 <h3 style={{color: 'var(--text-primary)'}}>My Orders</h3>
                 <p style={{color: 'var(--text-primary)', padding: '20px 0'}}>You haven't placed any orders yet.</p>
               </div>
            )}

            {currentTab === 'wishlist' && (
               <div className="profile-info-card">
                 <h3>Wishlist</h3>
                 {wishlist?.length > 0 ? (
                   <div className="books-grid profile-wishlist-grid" style={{ marginTop: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                     {wishlist.map(book => (
                       <BookCard key={book._id || book.id} book={book} wishlist={wishlist} toggleWishlist={toggleWishlist} />
                     ))}
                   </div>
                 ) : (
                   <p style={{color: 'var(--text-light)', padding: '20px 0'}}>Your wishlist is empty.</p>
                 )}
               </div>
            )}

            {currentTab === 'library' && (
               <div className="profile-info-card">
                 <h3>My Library</h3>
                 <div className="orders-list">
                    <div className="order-row">
                      <div>
                        <h4>The Psychology of Money</h4>
                        <p className="order-detail">Morgan Housel</p>
                      </div>
                      <button className="btn-primary" style={{padding: '5px 15px', fontSize: '0.8rem'}} onClick={() => handleReadNow('The Psychology of Money')}>Read Now</button>
                    </div>
                    <div className="order-row">
                      <div>
                        <h4>Atomic Habits</h4>
                        <p className="order-detail">James Clear</p>
                      </div>
                      <button className="btn-primary" style={{padding: '5px 15px', fontSize: '0.8rem'}} onClick={() => handleReadNow('Atomic Habits')}>Read Now</button>
                    </div>
                    <div className="order-row">
                      <div>
                        <h4>Deep Work</h4>
                        <p className="order-detail">Cal Newport</p>
                      </div>
                      <button className="btn-primary" style={{padding: '5px 15px', fontSize: '0.8rem'}} onClick={() => handleReadNow('Deep Work')}>Read Now</button>
                    </div>
                    <div className="order-row">
                      <div>
                        <h4>Dune</h4>
                        <p className="order-detail">Frank Herbert</p>
                      </div>
                      <button className="btn-primary" style={{padding: '5px 15px', fontSize: '0.8rem'}} onClick={() => handleReadNow('Dune')}>Read Now</button>
                    </div>
                 </div>
               </div>
            )}

            {currentTab === 'settings' && (
               <div className="profile-info-card">
                 <h3>Account Settings</h3>
                 <form style={{marginTop: '20px'}} onSubmit={async (e) => {
                   e.preventDefault();
                   if (pwdForm.newPassword !== pwdForm.confirmPassword) {
                     return setPwdMsg('Passwords do not match.');
                   }
                   setPwdMsg('Updating...');
                   try {
                     await api.put('/api/v1/user/changepassword', { oldPassword: pwdForm.oldPassword, newPassword: pwdForm.newPassword });
                     setPwdMsg('Password updated successfully!');
                     setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                   } catch (err) {
                     setPwdMsg(err.message || 'Failed to update password.');
                   }
                   setTimeout(() => setPwdMsg(''), 3000);
                 }}>
                   <div className="form-group" style={{marginBottom: '15px'}}>
                     <label>Current Password</label>
                     <input type="password" placeholder="Current Password" className="form-input" value={pwdForm.oldPassword} onChange={(e) => setPwdForm({...pwdForm, oldPassword: e.target.value})} required />
                   </div>
                   <div className="form-group" style={{marginBottom: '15px'}}>
                     <label>New Password</label>
                     <input type="password" placeholder="New Password" className="form-input" value={pwdForm.newPassword} onChange={(e) => setPwdForm({...pwdForm, newPassword: e.target.value})} required />
                   </div>
                   <div className="form-group" style={{marginBottom: '15px'}}>
                     <label>Confirm New Password</label>
                     <input type="password" placeholder="Confirm New Password" className="form-input" value={pwdForm.confirmPassword} onChange={(e) => setPwdForm({...pwdForm, confirmPassword: e.target.value})} required />
                   </div>
                   {pwdMsg && <p style={{color: pwdMsg.includes('success') ? 'green' : 'red', marginBottom: '10px', fontSize: '0.9rem'}}>{pwdMsg}</p>}
                   <button type="submit" className="btn-primary">Update Password</button>
                 </form>
                 <div>
                 </div>
                 <hr style={{margin: '30px 0', borderColor: 'var(--border-color)'}} />
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <h4 style={{marginBottom: '5px'}}>Email Notifications</h4>
                      <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Receive offers and updates</p>
                    </div>
                    <input type="checkbox" defaultChecked style={{transform: 'scale(1.5)'}} />
                 </div>
               </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
