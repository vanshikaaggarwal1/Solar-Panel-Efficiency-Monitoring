import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import {
  Sun, Mail, Lock, User, ShieldCheck, ArrowRight, ArrowLeft,
  Home,
  Building2,
  Factory,
  CheckCircle2
} from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("");
  const [profileData, setProfileData] = useState({
    siteName: '',
    location: '',
    solarInstalled: '',
    capacity: '',
    panelCount: '',
    panelType: '',
    battery: '',
    batteryType: '',
    gridConnected: '',

    organizationName: '',
    industry: '',
    solarSites: '',
    totalCapacity: '',
    users: '',
    organizationType: '',
    panels: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();


  const updateProfileData = (e) => {
    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const selectAccountType = (type) => {
    setAccountType(type);
    setStep(2);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match.', type: 'error' });
      return;
    }
    setSubmitting(true);

    try {
      const registrationData = {
        name,
        email,
        password,
        accountType,
        ...profileData
      };

      // Store complete registration data temporarily on frontend
      localStorage.setItem(
        'solarixRegistration',
        JSON.stringify(registrationData)
      );
      
      const res = await register({
        name,
        email,
        password,
        accountType,
        ...profileData
      });

      if (res.success) {
        setToast({ message: 'Account registered! Redirecting to dashboard...', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 400);
      } else {
        setToast({ message: res.error || 'Registration failed.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Registration error.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warmBg dark:bg-[#121212] px-4 py-12 transition-colors">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-3 left-3 p-2 rounded-xl text-secondaryText hover:text-primaryText hover:bg-warmBg dark:hover:bg-[#222] transition-colors"
        title="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="w-full max-w-md space-y-6">

        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-forest-500 text-white flex items-center justify-center shadow-subtle">
            <Sun className="w-5 h-5 text-sand-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-primaryText dark:text-white">
            Register Operator Credentials
          </h2>
          <p className="text-xs text-secondaryText">
            Join the Solarix Industrial Telemetry Platform
          </p>
        </div>

        {/* Card Form */}
        <div className="saas-card p-6 space-y-4 bg-white dark:bg-[#181818] border border-borderNeutral dark:border-[#262626]">
          {step === 1 && (
            <div className="space-y-4">

              <div>
                <h3 className="font-semibold text-primaryText dark:text-white">
                  How will you use Solarix?
                </h3>

                <p className="text-xs text-secondaryText mt-1">
                  Choose the option that best describes your solar setup.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-3">

                <button
                  type="button"
                  onClick={() => selectAccountType('personal')}
                  className="p-5 text-left rounded-xl border border-borderNeutral dark:border-[#333] hover:border-forest-500 transition"
                >
                  <Home className="w-5 h-5 text-forest-500 mb-3" />

                  <h3 className="font-semibold text-primaryText dark:text-white">
                    Personal
                  </h3>

                  <p className="text-[11px] text-secondaryText text-center mt-2">
                    Residential Solar Management
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => selectAccountType('business')}
                  className="p-5 text-left rounded-xl border border-borderNeutral dark:border-[#333] hover:border-forest-500 transition"
                >
                  <Building2 className="w-5 h-5 text-forest-500 mb-3" />

                  <h3 className="font-semibold text-primaryText dark:text-white">
                    Business
                  </h3>

                  <p className="text-[11px] text-secondaryText text-center mt-2">
                    Commercial Solar Management
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => selectAccountType('enterprise')}
                  className="p-5 text-left rounded-xl border border-borderNeutral dark:border-[#333] hover:border-forest-500 transition"
                >
                  <Factory className="w-5 h-5 text-forest-500 mb-3" />

                  <h3 className="font-semibold text-primaryText dark:text-white">
                    Enterprise
                  </h3>

                  <p className="text-[11px] text-secondaryText text-center mt-2">
                    Multi-Site Solar Management
                  </p>
                </button>

              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">

              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-xs text-secondaryText"
              >
                <ArrowLeft className="w-3 h-3" />
                Change account type
              </button>

              {/* PERSONAL */}

              {accountType === 'personal' && (
                <>
                  <Input
                    label="Solar Site Name"
                    name="siteName"
                    placeholder="My Home"
                    value={profileData.siteName}
                    onChange={updateProfileData}
                  />

                  <Input
                    label="Location"
                    name="location"
                    placeholder="Ludhiana, Punjab"
                    value={profileData.location}
                    onChange={updateProfileData}
                  />

                  <Select
                    label="Do you already have a solar system?"
                    name="solarInstalled"
                    value={profileData.solarInstalled}
                    onChange={updateProfileData}
                    options={[
                      ['yes', 'Yes'],
                      ['no', "No, I'm planning one"]
                    ]}
                  />

                  {profileData.solarInstalled === 'yes' && (
                    <>
                      <Input
                        label="Solar Capacity"
                        name="capacity"
                        placeholder="5 kW"
                        value={profileData.capacity}
                        onChange={updateProfileData}
                      />

                      <Input
                        label="Number of Panels"
                        name="panelCount"
                        placeholder="10"
                        value={profileData.panelCount}
                        onChange={updateProfileData}
                      />

                      <Select
                        label="Panel Technology"
                        name="panelType"
                        value={profileData.panelType}
                        onChange={updateProfileData}
                        options={[
                          ['monocrystalline', 'Monocrystalline'],
                          ['polycrystalline', 'Polycrystalline'],
                          ['thin-film', 'Thin-Film'],
                          ['topcon', 'TOPCon'],
                          ['hjt', 'HJT'],
                          ['other', 'Other'],
                          ['unknown', "I don't know"]
                        ]}
                      />

                      <Select
                        label="Do you have battery storage?"
                        name="battery"
                        value={profileData.battery}
                        onChange={updateProfileData}
                        options={[
                          ['yes', 'Yes'],
                          ['no', 'No'],
                          ['planning', 'Planning to install'],
                          ['unknown', "I don't know"]
                        ]}
                      />

                      {profileData.battery === 'yes' && (
                        <Select
                          label="Battery Type"
                          name="batteryType"
                          value={profileData.batteryType}
                          onChange={updateProfileData}
                          options={[
                            ['lithium-ion', 'Lithium-ion'],
                            ['lifepo4', 'LiFePO₄'],
                            ['lead-acid', 'Lead-acid'],
                            ['flow', 'Flow Battery'],
                            ['other', 'Other'],
                            ['unknown', "I don't know"]
                          ]}
                        />
                      )}

                      <Select
                        label="Is your system connected to the electricity grid?"
                        name="gridConnected"
                        value={profileData.gridConnected}
                        onChange={updateProfileData}
                        options={[
                          ['yes', 'Yes'],
                          ['no', 'No'],
                          ['unknown', "I don't know"]
                        ]}
                      />
                    </>
                  )}
                </>
              )}

              {/* BUSINESS */}

              {accountType === 'business' && (
                <>
                  <Input
                    label="Business / Organization Name"
                    name="organizationName"
                    placeholder="ABC Manufacturing"
                    value={profileData.organizationName}
                    onChange={updateProfileData}
                  />

                  <Select
                    label="Industry"
                    name="industry"
                    value={profileData.industry}
                    onChange={updateProfileData}
                    options={[
                      ['manufacturing', 'Manufacturing'],
                      ['retail', 'Retail'],
                      ['hospitality', 'Hospitality'],
                      ['education', 'Education'],
                      ['healthcare', 'Healthcare'],
                      ['agriculture', 'Agriculture'],
                      ['commercial', 'Office / Commercial'],
                      ['other', 'Other']
                    ]}
                  />

                  <Select
                    label="How many solar sites do you manage?"
                    name="solarSites"
                    value={profileData.solarSites}
                    onChange={updateProfileData}
                    options={[
                      ['1', '1'],
                      ['2-5', '2–5'],
                      ['6-20', '6–20'],
                      ['20+', '20+']
                    ]}
                  />

                  <Select
                    label="Approximate total capacity"
                    name="totalCapacity"
                    value={profileData.totalCapacity}
                    onChange={updateProfileData}
                    options={[
                      ['under10', 'Under 10 kW'],
                      ['10-100', '10–100 kW'],
                      ['100-1mw', '100 kW–1 MW'],
                      ['1mw+', '1 MW+'],
                      ['unknown', "I don't know"]
                    ]}
                  />

                  <Select
                    label="How many people will use Solarix?"
                    name="users"
                    value={profileData.users}
                    onChange={updateProfileData}
                    options={[
                      ['1', 'Just me'],
                      ['2-5', '2–5'],
                      ['6-20', '6–20'],
                      ['21-100', '21–100'],
                      ['100+', '100+']
                    ]}
                  />
                </>
              )}

              {/* ENTERPRISE */}

              {accountType === 'enterprise' && (
                <>
                  <Input
                    label="Company / Organization Name"
                    name="organizationName"
                    placeholder="ABC Solar Energy"
                    value={profileData.organizationName}
                    onChange={updateProfileData}
                  />

                  <Select
                    label="Organization Type"
                    name="organizationType"
                    value={profileData.organizationType}
                    onChange={updateProfileData}
                    options={[
                      ['developer', 'Solar Developer'],
                      ['epc', 'Solar EPC'],
                      ['om', 'Solar O&M'],
                      ['utility', 'Utility'],
                      ['manufacturing', 'Manufacturing'],
                      ['commercial', 'Commercial Enterprise'],
                      ['government', 'Government / Institution'],
                      ['other', 'Other']
                    ]}
                  />

                  <Select
                    label="How many solar sites do you manage?"
                    name="solarSites"
                    value={profileData.solarSites}
                    onChange={updateProfileData}
                    options={[
                      ['1-5', '1–5'],
                      ['6-20', '6–20'],
                      ['21-100', '21–100'],
                      ['100+', '100+']
                    ]}
                  />

                  <Select
                    label="Approximate total capacity"
                    name="totalCapacity"
                    value={profileData.totalCapacity}
                    onChange={updateProfileData}
                    options={[
                      ['under1mw', 'Under 1 MW'],
                      ['1-10mw', '1–10 MW'],
                      ['10-100mw', '10–100 MW'],
                      ['100mw+', '100 MW+']
                    ]}
                  />

                  <Select
                    label="How many people will use Solarix?"
                    name="users"
                    value={profileData.users}
                    onChange={updateProfileData}
                    options={[
                      ['1-10', '1–10'],
                      ['11-50', '11–50'],
                      ['51-250', '51–250'],
                      ['250-1000', '250–1,000'],
                      ['1000+', '1,000+']
                    ]}
                  />
                </>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="w-full py-2.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-secondaryText mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Alexander Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="operator@solarix.energy"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="•••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-secondaryText mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-forest-500 hover:bg-forest-600 text-white font-semibold text-xs shadow-subtle flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        <div className="text-center text-xs text-secondaryText">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-forest-500 hover:underline">
            Sign In to Console
          </Link>
        </div>

      </div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  );
};
const Input = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = 'text'
}) => (
  <div>
    <label className="block font-semibold text-secondaryText mb-1">
      {label}
    </label>

    <input
      type={type}
      name={name}
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-500"
    />
  </div>
);


const Select = ({
  label,
  name,
  value,
  onChange,
  options
}) => (
  <div>
    <label className="block font-semibold text-secondaryText mb-1">
      {label}
    </label>

    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-3 py-2.5 rounded-xl bg-warmBg dark:bg-[#222] border border-borderNeutral dark:border-[#333] text-primaryText dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-forest-500"
    >
      <option value="">Select an option</option>

      {options.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </div>
);
export default RegisterPage;
