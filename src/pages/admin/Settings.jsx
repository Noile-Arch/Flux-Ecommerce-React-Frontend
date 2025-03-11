import { useState } from "react";
import { toast } from "react-toastify";
import { FiSave, FiGlobe, FiTool, FiUserPlus } from "react-icons/fi";
import api from "../../config/axios_api";
import PropTypes from "prop-types";

const SettingCard = ({ icon: Icon, title, description, children }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-orange-100 rounded-lg">
        <Icon className="h-6 w-6 text-orange-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-4">{description}</p>
        {children}
      </div>
    </div>
  </div>
);

SettingCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ${
        checked ? 'bg-orange-500' : 'bg-gray-300'
      }`} />
      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${
        checked ? 'translate-x-6' : 'translate-x-0'
      }`} />
    </div>
    <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
  </label>
);

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "Flux",
    maintenanceMode: false,
    allowRegistration: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post("/admin/settings", settings);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500">Configure your application settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SettingCard
          icon={FiGlobe}
          title="General Settings"
          description="Basic configuration for your application"
        >
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
        </SettingCard>

        <SettingCard
          icon={FiTool}
          title="Maintenance"
          description="Control system maintenance mode"
        >
          <Toggle
            checked={settings.maintenanceMode}
            onChange={(e) => handleChange({
              target: {
                name: 'maintenanceMode',
                type: 'checkbox',
                checked: e.target.checked
              }
            })}
            label="Enable Maintenance Mode"
          />
        </SettingCard>

        <SettingCard
          icon={FiUserPlus}
          title="Registration"
          description="Manage user registration settings"
        >
          <Toggle
            checked={settings.allowRegistration}
            onChange={(e) => handleChange({
              target: {
                name: 'allowRegistration',
                type: 'checkbox',
                checked: e.target.checked
              }
            })}
            label="Allow New Registrations"
          />
        </SettingCard>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-300 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="mr-2 h-5 w-5" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings; 