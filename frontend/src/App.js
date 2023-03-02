import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./contexts/authContext";
import PhotoUploadPage from "./pages/PhotoUploadPage";
import { PhotoProvider } from "./contexts/photoContext";
import SingleUploadPage from "./pages/SingleUploadPage";
import SavedUploadPage from "./pages/SavedUploadPage";
import ExploreFeedPage from "./pages/ExploreFeedPage";
import NotificationsPage from "./pages/NotificationsPage";
import AccountPage from "./pages/AccountPage";
import UsersPage from "./pages/UsersPage";
import AccountEditPage from "./pages/AccountEditPage";
import UploadEditPage from "./pages/UploadEditPage";
import UserFollowsPage from "./pages/UserFollowsPage";

function App() {
    return (
        <Router>
            <AuthProvider>
                <PhotoProvider>
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/auth/login" element={<LoginPage />} />
                            <Route
                                path="/auth/register"
                                element={<RegisterPage />}
                            />
                            <Route path="/" element={<HomePage />} />
                            <Route
                                path="/uploads/create"
                                element={<PhotoUploadPage />}
                            />

                            <Route
                                path="/uploads/:id"
                                element={<SingleUploadPage />}
                            />
                            <Route
                                path="/saved"
                                element={<SavedUploadPage />}
                            />
                            <Route
                                path="/explore"
                                element={<ExploreFeedPage />}
                            />
                            <Route
                                path="/notifications"
                                element={<NotificationsPage />}
                            />
                            <Route path="/account" element={<AccountPage />} />

                            <Route
                                path="/account/edit"
                                element={<AccountEditPage />}
                            />

                            <Route path="/users" element={<UsersPage />} />

                            <Route
                                path="/uploads/:id/edit"
                                element={<UploadEditPage />}
                            />

                            <Route
                                path="/follows"
                                element={<UserFollowsPage />}
                            />
                        </Routes>
                    </main>
                </PhotoProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
