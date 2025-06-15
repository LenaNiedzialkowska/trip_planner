import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import Button from "@mui/material/Button";

interface User {
  userId?: string;
  currentUsername: string;
}

export default function Settings({ userId, currentUsername }: User) {
  const [username, setUsername] = useState<string>(currentUsername);
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          ...(newPassword && password ? { password, newPassword } : {}),
        }),
      });

      if (response.ok) {
        console.log("Account updated");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

const deleteAccount = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setSnackbar({ open: true, message: "Account deleted", severity: "success" });
      setTimeout(() => navigate("/login"), 1500); // przekieruj po chwili
    } else {
      setSnackbar({ open: true, message: "Failed to delete account", severity: "error" });
    }
  } catch (error) {
    setSnackbar({ open: true, message: "Error deleting account", severity: "error" });
    console.error("Error:", error);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleAccountUpdate}
        className="w-full max-w-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter new username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            className="mt-1 p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center space-x-2 pt-4">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
          >
            Log Out
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Save Settings
          </button>
        </div>

        <button
          type="button"
           color="error" onClick={() => setOpenDeleteDialog(true)}
          className="w-full mt-4 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
            // onClick={() => {deleteAccount()}}
        >
          Delete My Account
        </button>
      </form>
      <Dialog
  open={openDeleteDialog}
  onClose={() => setOpenDeleteDialog(false)}
>
  <DialogTitle>Confirm Account Deletion</DialogTitle>
  <DialogContent>
    <DialogContentText>
      This action is irreversible. Are you sure you want to delete your account?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
    <Button onClick={deleteAccount} color="error">
      Delete
    </Button>
  </DialogActions>
</Dialog>

<Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
/>

    </div>
  );
}
