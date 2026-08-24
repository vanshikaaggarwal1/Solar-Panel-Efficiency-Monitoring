import React, { useMemo, useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import {
    fetchUsersApi,
    createUserApi,
    updateUserApi,
    deleteUserApi,
    updateUserStatusApi
} from '../services/api';

import {
    Search,
    Plus,
    MoreVertical,
    ShieldCheck,
    User,
    Users,
    UserCog,
    CheckCircle2,
    XCircle,
    Edit3,
    Trash2,
    Power,
    X,
    Mail,
    Lock,
    ChevronDown,
    UserRoundPlus
} from 'lucide-react';

/* =========================================================
   ROLE STYLES
========================================================= */

const roleStyles = {
    Admin: {
        bg: 'bg-forest-500/15',
        text: 'text-forest-400',
        border: 'border-forest-500/20'
    },

    Administrator: {
        bg: 'bg-forest-500/15',
        text: 'text-forest-400',
        border: 'border-forest-500/20'
    },

    Manager: {
        bg: 'bg-sand-400/15',
        text: 'text-sand-400',
        border: 'border-sand-400/20'
    },

    Operator: {
        bg: 'bg-copper-500/15',
        text: 'text-copper-400',
        border: 'border-copper-500/20'
    },

    Technician: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20'
    },

    Viewer: {
        bg: 'bg-slate-500/15',
        text: 'text-slate-300',
        border: 'border-slate-500/20'
    }
};

/* =========================================================
   USER MANAGEMENT
========================================================= */

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: '', type: 'info' });

    /* Search & Filters */
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    /* Modals */
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    /* Selected user */
    const [selectedUser, setSelectedUser] = useState(null);

    /* Action menu */
    const [openMenu, setOpenMenu] = useState(null);

    /* Form */
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        accountType: 'Operator',
        status: 'Active'
    });

    /* =====================================================
       FETCH USERS FROM MONGODB
    ===================================================== */

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await fetchUsersApi();
            if (res.data && res.data.success) {
                setUsers(res.data.users || []);
            }
        } catch (err) {
            console.error('Error fetching users from database:', err);
            setToast({
                message: err.response?.data?.message || 'Failed to fetch users from database.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    /* =====================================================
       FILTER USERS
    ===================================================== */

    const filteredUsers = useMemo(() => {
        const search = searchTerm.toLowerCase().trim();

        return users.filter((user) => {
            const nameMatch = user.name ? user.name.toLowerCase().includes(search) : false;
            const emailMatch = user.email ? user.email.toLowerCase().includes(search) : false;
            const matchesSearch = nameMatch || emailMatch;

            const userRoleOrType = user.accountType || user.role || 'User';
            const matchesRole =
                roleFilter === 'All' ||
                userRoleOrType === roleFilter;

            const userStatus = user.status || 'Active';
            const matchesStatus =
                statusFilter === 'All' ||
                userStatus === statusFilter;

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );
        });
    }, [
        users,
        searchTerm,
        roleFilter,
        statusFilter
    ]);

    /* =====================================================
       STATISTICS
    ===================================================== */

    const totalUsers = users.length;

    const activeUsers = users.filter(
        (user) => (user.status || 'Active') === 'Active'
    ).length;

    const inactiveUsers = users.filter(
        (user) => user.status === 'Inactive'
    ).length;

    const adminCount = users.filter(
        (user) => user.accountType === 'Admin' || user.accountType === 'Administrator' || user.role === 'Admin' || user.role === 'Administrator'
    ).length;

    /* =====================================================
       FORM HANDLING
    ===================================================== */

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            accountType: 'Operator',
            status: 'Active'
        });
    };

    /* =====================================================
       CREATE USER (PERSIST IN MONGODB)
    ===================================================== */

    const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: formData.accountType,
            accountType: formData.accountType,
            status: formData.status
        };

        console.log("Creating user with:", payload);

        const res = await createUserApi(payload);

        console.log("Create user response:", res.data);

        if (res.data?.success) {
            setToast({
                message: 'User created successfully!',
                type: 'success'
            });

            resetForm();
            setShowCreateModal(false);

            await loadUsers();
        } else {
            setToast({
                message: res.data?.message || 'Failed to create user.',
                type: 'error'
            });
        }

    } catch (err) {
        console.error("CREATE USER ERROR:", err);
        console.error("STATUS:", err.response?.status);
        console.error("DATA:", err.response?.data);

        setToast({
            message:
                err.response?.data?.message ||
                err.message ||
                'Error creating user.',
            type: 'error'
        });
    }
};

    /* =====================================================
       OPEN EDIT MODAL
    ===================================================== */

    const openEditModal = (user) => {
        setSelectedUser(user);

        setFormData({
            name: user.name || '',
            email: user.email || '',
            password: '',
            accountType: user.accountType || user.role || 'Operator',
            status: user.status || 'Active'
        });

        setOpenMenu(null);
        setShowEditModal(true);
    };

    /* =====================================================
       UPDATE USER (PERSIST IN MONGODB)
    ===================================================== */

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        if (!selectedUser) {
            return;
        }

        const userId = selectedUser._id || selectedUser.id;

        try {
            const res = await updateUserApi(userId, {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.accountType,
                accountType: formData.accountType,
                status: formData.status
            });

            if (res.data && res.data.success) {
                setToast({ message: 'User updated successfully in MongoDB!', type: 'success' });
                setShowEditModal(false);
                setSelectedUser(null);
                resetForm();
                await loadUsers();
            } else {
                setToast({ message: res.data?.message || 'Failed to update user.', type: 'error' });
            }
        } catch (err) {
            setToast({
                message: err.response?.data?.message || 'Error updating user in database.',
                type: 'error'
            });
        }
    };

    /* =====================================================
       TOGGLE USER STATUS (PERSIST IN MONGODB)
    ===================================================== */

    const toggleStatus = async (id) => {
        setOpenMenu(null);
        const user = users.find(u => (u._id === id || u.id === id));
        if (!user) return;

        const targetId = user._id || user.id;
        const currentStatus = user.status || 'Active';
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

        try {
            const res = await updateUserStatusApi(targetId, newStatus);
            if (res.data && res.data.success) {
                setToast({ message: `User status changed to ${newStatus}.`, type: 'success' });
                await loadUsers();
            }
        } catch (err) {
            setToast({
                message: err.response?.data?.message || 'Failed to update user status.',
                type: 'error'
            });
        }
    };

    /* =====================================================
       DELETE USER (PERSIST IN MONGODB)
    ===================================================== */

    const deleteUser = async (id) => {
        setOpenMenu(null);
        const user = users.find(u => (u._id === id || u.id === id));

        if (!user) {
            return;
        }

        const userRole = user.accountType || user.role;
        if (
            (userRole === 'Admin' || userRole === 'Administrator') &&
            adminCount <= 1
        ) {
            window.alert('At least one Admin account must remain in the database.');
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${user.name}'s account from MongoDB?`
        );

        if (!confirmed) {
            return;
        }

        const targetId = user._id || user.id;

        try {
            const res = await deleteUserApi(targetId);
            if (res.data && res.data.success) {
                setToast({ message: 'User deleted from MongoDB.', type: 'success' });
                await loadUsers();
            }
        } catch (err) {
            setToast({
                message: err.response?.data?.message || 'Failed to delete user from database.',
                type: 'error'
            });
        }
    };

    /* =====================================================
       CLOSE ALL MENUS
    ===================================================== */

    const closeMenu = () => {
        setOpenMenu(null);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            className="
            flex min-h-screen bg-warmBg dark:bg-[#121212] text-primaryText dark:text-neutral-100 transition-colors
            "
            onClick={closeMenu}
        >
            <Sidebar />

            <main
                className="
                    flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6
                "
                onClick={(e) => e.stopPropagation()}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <section
                    className="
                        border
                        border-[#E5E1DB]
                        dark:border-[#2A2A2A]
                        rounded-2xl
                        bg-white/70
                        dark:bg-[#1F1F1F]/80
                        backdrop-blur-sm
                        overflow-hidden
                    "
                >
                    <div className="px-6 lg:px-8 py-5">

                        <div
                            className="
                                flex
                                flex-col
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                                gap-4
                            "
                        >

                            {/* Heading */}

                            <div>

                                <div className="flex items-center gap-2 mb-1">

                                    <ShieldCheck
                                        className="
                                            w-4
                                            h-4
                                            text-forest-500
                                        "
                                    />

                                    <span
                                        className="
                                            text-[10px]
                                            uppercase
                                            tracking-[0.15em]
                                            font-semibold
                                            text-slate-500
                                            dark:text-slate-400
                                        "
                                    >
                                        System Administration
                                    </span>

                                </div>

                                <h1
                                    className="
                                        text-xl
                                        font-semibold
                                        tracking-tight
                                        text-slate-900
                                        dark:text-white
                                    "
                                >
                                    User Management
                                </h1>

                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                        dark:text-slate-400
                                        mt-1
                                    "
                                >
                                    Manage Solarix accounts, roles
                                    and access permissions
                                </p>

                            </div>

                            {/* Create Button */}

                            <button
                                type="button"
                                onClick={() => {
                                    resetForm();
                                    setShowCreateModal(true);
                                }}
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-forest-500
                                    hover:bg-forest-600
                                    text-white
                                    text-xs
                                    font-semibold
                                    transition-colors
                                    shadow-sm
                                "
                            >
                                <Plus className="w-4 h-4" />

                                Create Account
                            </button>

                        </div>

                    </div>
                </section>

                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        xl:grid-cols-4
                        gap-4
                    "
                >

                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={totalUsers}
                        description="Registered accounts"
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Active Accounts"
                        value={activeUsers}
                        description="Currently enabled"
                        iconClass="text-forest-500"
                    />

                    <StatCard
                        icon={XCircle}
                        label="Inactive Accounts"
                        value={inactiveUsers}
                        description="Currently disabled"
                        iconClass="text-copper-500"
                    />

                    <StatCard
                        icon={UserCog}
                        label="Administrators"
                        value={adminCount}
                        description="System administrators"
                        iconClass="text-sand-500"
                    />

                </section>

                {/* =================================================
                    USERS CARD
                ================================================= */}

                <section
                    className="
                        bg-white
                        dark:bg-[#1F1F1F]
                        border
                        border-[#E5E1DB]
                        dark:border-[#2A2A2A]
                        rounded-2xl
                        shadow-sm
                        overflow-hidden
                    "
                >

                    {/* =================================================
                        TOOLBAR
                    ================================================= */}

                    <div
                        className="
                            p-4
                            border-b
                            border-[#E5E1DB]
                            dark:border-[#2A2A2A]
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                xl:flex-row
                                gap-3
                                xl:items-center
                                xl:justify-between
                            "
                        >

                            {/* Search */}

                            <div
                                className="
                                    relative
                                    flex-1
                                    max-w-md
                                "
                            >

                                <Search
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        w-4
                                        h-4
                                        text-slate-400
                                    "
                                />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search users..."
                                    className="
                                        w-full
                                        pl-9
                                        pr-4
                                        py-2.5
                                        rounded-xl
                                        bg-[#F7F5F2]
                                        dark:bg-[#262626]
                                        border
                                        border-[#E5E1DB]
                                        dark:border-[#333333]
                                        text-xs
                                        text-slate-800
                                        dark:text-white
                                        placeholder:text-slate-400
                                        focus:outline-none
                                        focus:ring-1
                                        focus:ring-forest-500
                                    "
                                />

                            </div>

                            {/* Filters */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    gap-2
                                "
                            >

                                <FilterSelect
                                    value={roleFilter}
                                    onChange={setRoleFilter}
                                    options={[
                                        'All',
                                        'Admin',
                                        'Manager',
                                        'Operator',
                                        'Technician',
                                        'Viewer'
                                    ]}
                                />

                                <FilterSelect
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={[
                                        'All',
                                        'Active',
                                        'Inactive'
                                    ]}
                                />

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="overflow-x-auto">

                        <table
                            className="
                                w-full
                                min-w-[850px]
                            "
                        >

                            {/* Header */}

                            <thead>

                                <tr
                                    className="
                                        border-b
                                        border-[#E5E1DB]
                                        dark:border-[#2A2A2A]
                                        bg-[#FAF9F7]
                                        dark:bg-[#232323]
                                    "
                                >

                                    <TableHeader>
                                        User
                                    </TableHeader>

                                    <TableHeader>
                                        Account Type
                                    </TableHeader>

                                    <TableHeader>
                                        Status
                                    </TableHeader>

                                    <TableHeader>
                                        Joined
                                    </TableHeader>

                                    <th
                                        className="
                                            text-right
                                            px-6
                                            py-3
                                            text-[10px]
                                            uppercase
                                            tracking-wider
                                            font-semibold
                                            text-slate-500
                                        "
                                    >
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            {/* Body */}

                            <tbody>

                                {filteredUsers.length > 0 ? (

                                    filteredUsers.map((user) => {
                                        const userId = user._id || user.id;
                                        const userRole = user.accountType || user.role || 'Viewer';
                                        const roleStyle = roleStyles[userRole] || roleStyles.Viewer;

                                        return (
                                            <tr
                                                key={userId}
                                                className="
                                                    border-b
                                                    border-[#E5E1DB]
                                                    dark:border-[#2A2A2A]
                                                    last:border-b-0
                                                    hover:bg-[#FAF9F7]
                                                    dark:hover:bg-[#252525]
                                                    transition-colors
                                                "
                                            >

                                                {/* User */}

                                                <td className="px-6 py-4">

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                w-9
                                                                h-9
                                                                rounded-xl
                                                                bg-forest-500/10
                                                                flex
                                                                items-center
                                                                justify-center
                                                                flex-shrink-0
                                                            "
                                                        >
                                                            <User
                                                                className="
                                                                    w-4
                                                                    h-4
                                                                    text-forest-500
                                                                "
                                                            />
                                                        </div>

                                                        <div className="min-w-0">

                                                            <p
                                                                className="
                                                                    text-xs
                                                                    font-semibold
                                                                    text-slate-800
                                                                    dark:text-white
                                                                "
                                                            >
                                                                {user.name}
                                                            </p>

                                                            <p
                                                                className="
                                                                    text-[11px]
                                                                    text-slate-500
                                                                    dark:text-slate-400
                                                                    truncate
                                                                "
                                                            >
                                                                {user.email}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* Account Type */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            px-2.5
                                                            py-1
                                                            rounded-lg
                                                            border
                                                            text-[10px]
                                                            font-semibold
                                                            ${roleStyle.bg}
                                                            ${roleStyle.text}
                                                            ${roleStyle.border}
                                                        `}
                                                    >

                                                        <ShieldCheck
                                                            className="
                                                                w-3
                                                                h-3
                                                            "
                                                        />

                                                        {userRole}

                                                    </span>

                                                </td>

                                                {/* Status */}

                                                <td className="px-6 py-4">

                                                    {user.status === 'Active' ? (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                text-[10px]
                                                                font-semibold
                                                                text-forest-500
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                    w-1.5
                                                                    h-1.5
                                                                    rounded-full
                                                                    bg-forest-500
                                                                "
                                                            />

                                                            Active

                                                        </span>

                                                    ) : (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                text-[10px]
                                                                font-semibold
                                                                text-slate-400
                                                            "
                                                        >

                                                            <span
                                                                className="
                                                                    w-1.5
                                                                    h-1.5
                                                                    rounded-full
                                                                    bg-slate-500
                                                                "
                                                            />

                                                            Inactive

                                                        </span>

                                                    )}

                                                </td>

                                                {/* Joined */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className="
                                                            text-[11px]
                                                            text-slate-500
                                                            dark:text-slate-400
                                                        "
                                                    >
                                                        {user.joined}
                                                    </span>

                                                </td>

                                                {/* Actions */}

                                                <td className="px-6 py-4">

                                                    <div
                                                        className="
                                                            flex
                                                            justify-end
                                                            relative
                                                        "
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setOpenMenu(
                                                                    openMenu === userId
                                                                        ? null
                                                                        : userId
                                                                )
                                                            }
                                                            className="
                                                                w-8
                                                                h-8
                                                                rounded-lg
                                                                flex
                                                                items-center
                                                                justify-center
                                                                text-slate-400
                                                                hover:text-slate-800
                                                                dark:hover:text-white
                                                                hover:bg-[#F7F5F2]
                                                                dark:hover:bg-[#2A2A2A]
                                                                transition-colors
                                                            "
                                                        >
                                                            <MoreVertical
                                                                className="
                                                                    w-4
                                                                    h-4
                                                                "
                                                            />
                                                        </button>

                                                        {openMenu === userId && (

                                                            <div
                                                                className="
                                                                    absolute
                                                                    right-0
                                                                    top-9
                                                                    w-44
                                                                    bg-white
                                                                    dark:bg-[#262626]
                                                                    border
                                                                    border-[#E5E1DB]
                                                                    dark:border-[#333333]
                                                                    rounded-xl
                                                                    shadow-xl
                                                                    z-20
                                                                    p-1
                                                                "
                                                            >

                                                                {/* Edit */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            user
                                                                        )
                                                                    }
                                                                    className="
                                                                        w-full
                                                                        flex
                                                                        items-center
                                                                        gap-2
                                                                        px-3
                                                                        py-2
                                                                        rounded-lg
                                                                        text-xs
                                                                        text-slate-600
                                                                        dark:text-slate-300
                                                                        hover:bg-[#F7F5F2]
                                                                        dark:hover:bg-[#303030]
                                                                    "
                                                                >

                                                                    <Edit3
                                                                        className="
                                                                            w-3.5
                                                                            h-3.5
                                                                        "
                                                                    />

                                                                    Edit Account

                                                                </button>

                                                                {/* Toggle */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        toggleStatus(
                                                                            userId
                                                                        )
                                                                    }
                                                                    className="
                                                                        w-full
                                                                        flex
                                                                        items-center
                                                                        gap-2
                                                                        px-3
                                                                        py-2
                                                                        rounded-lg
                                                                        text-xs
                                                                        text-slate-600
                                                                        dark:text-slate-300
                                                                        hover:bg-[#F7F5F2]
                                                                        dark:hover:bg-[#303030]
                                                                    "
                                                                >

                                                                    <Power
                                                                        className="
                                                                            w-3.5
                                                                            h-3.5
                                                                        "
                                                                    />

                                                                    {user.status ===
                                                                    'Active'
                                                                        ? 'Deactivate'
                                                                        : 'Activate'}

                                                                </button>

                                                                <div
                                                                    className="
                                                                        h-px
                                                                        bg-[#E5E1DB]
                                                                        dark:bg-[#333333]
                                                                        my-1
                                                                    "
                                                                />

                                                                {/* Delete */}

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        deleteUser(
                                                                            userId
                                                                        )
                                                                    }
                                                                    className="
                                                                        w-full
                                                                        flex
                                                                        items-center
                                                                        gap-2
                                                                        px-3
                                                                        py-2
                                                                        rounded-lg
                                                                        text-xs
                                                                        text-red-400
                                                                        hover:bg-red-500/10
                                                                    "
                                                                >

                                                                    <Trash2
                                                                        className="
                                                                            w-3.5
                                                                            h-3.5
                                                                        "
                                                                    />

                                                                    Delete Account

                                                                </button>

                                                            </div>
                                                        )}

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    })

                                ) : (

                                    /* Empty State */

                                    <tr>

                                        <td
                                            colSpan={5}
                                            className="
                                                px-6
                                                py-16
                                                text-center
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    items-center
                                                "
                                            >

                                                <div
                                                    className="
                                                        w-12
                                                        h-12
                                                        rounded-xl
                                                        bg-[#F7F5F2]
                                                        dark:bg-[#262626]
                                                        flex
                                                        items-center
                                                        justify-center
                                                        mb-3
                                                    "
                                                >
                                                    <Users
                                                        className="
                                                            w-5
                                                            h-5
                                                            text-slate-400
                                                        "
                                                    />
                                                </div>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-slate-700
                                                        dark:text-white
                                                    "
                                                >
                                                    No users found
                                                </p>

                                                <p
                                                    className="
                                                        text-xs
                                                        text-slate-400
                                                        mt-1
                                                    "
                                                >
                                                    Try changing your
                                                    search or filters.
                                                </p>

                                            </div>

                                        </td>

                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                        className="
                            px-6
                            py-3
                            border-t
                            border-[#E5E1DB]
                            dark:border-[#2A2A2A]
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <span
                            className="
                                text-[10px]
                                text-slate-400
                            "
                        >
                            Showing {filteredUsers.length} of{' '}
                            {users.length} accounts
                        </span>

                        <span
                            className="
                                text-[10px]
                                text-slate-400
                            "
                        >
                            Solarix Access Control
                        </span>

                    </div>

                </section>

            </main>

            {/* =====================================================
                CREATE MODAL
            ===================================================== */}

            {showCreateModal && (
                <UserModal
                    title="Create Account"
                    description="Create a new Solarix user account and assign an access role."
                    formData={formData}
                    onChange={handleInputChange}
                    onSubmit={handleCreateUser}
                    onClose={() => {
                        setShowCreateModal(false);
                        resetForm();
                    }}
                    submitText="Create Account"
                    isCreate={true}
                />
            )}

            {/* =====================================================
                EDIT MODAL
            ===================================================== */}

            {showEditModal && (
                <UserModal
                    title="Edit Account"
                    description="Update account information and access permissions."
                    formData={formData}
                    onChange={handleInputChange}
                    onSubmit={handleUpdateUser}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedUser(null);
                        resetForm();
                    }}
                    submitText="Save Changes"
                />
            )}

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: 'info' })}
            />

        </div>
    );
};

/* =========================================================
   TABLE HEADER
========================================================= */

const TableHeader = ({ children }) => {
    return (
        <th
            className="
                text-left
                px-6
                py-3
                text-[10px]
                uppercase
                tracking-wider
                font-semibold
                text-slate-500
            "
        >
            {children}
        </th>
    );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
    icon: Icon,
    label,
    value,
    description,
    iconClass = 'text-forest-500'
}) => {
    return (
        <div
            className="
                bg-white
                dark:bg-[#1F1F1F]
                border
                border-[#E5E1DB]
                dark:border-[#2A2A2A]
                rounded-2xl
                p-4
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            font-semibold
                            text-slate-500
                        "
                    >
                        {label}
                    </p>

                    <p
                        className="
                            text-2xl
                            font-semibold
                            text-slate-900
                            dark:text-white
                            mt-1
                        "
                    >
                        {value}
                    </p>

                    <p
                        className="
                            text-[10px]
                            text-slate-400
                            mt-1
                        "
                    >
                        {description}
                    </p>

                </div>

                <div
                    className="
                        w-9
                        h-9
                        rounded-xl
                        bg-[#F7F5F2]
                        dark:bg-[#262626]
                        flex
                        items-center
                        justify-center
                    "
                >
                    <Icon
                        className={`
                            w-4
                            h-4
                            ${iconClass}
                        `}
                    />
                </div>

            </div>

        </div>
    );
};

/* =========================================================
   FILTER SELECT
========================================================= */

const FilterSelect = ({
    value,
    onChange,
    options
}) => {
    return (
        <div className="relative">

            <select
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="
                    appearance-none
                    min-w-[145px]
                    pl-3
                    pr-8
                    py-2.5
                    rounded-xl
                    bg-[#F7F5F2]
                    dark:bg-[#262626]
                    border
                    border-[#E5E1DB]
                    dark:border-[#333333]
                    text-xs
                    text-slate-700
                    dark:text-slate-300
                    focus:outline-none
                    focus:ring-1
                    focus:ring-forest-500
                    cursor-pointer
                "
            >

                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option === 'All'
                            ? 'All'
                            : option}
                    </option>
                ))}

            </select>

            <ChevronDown
                className="
                    absolute
                    right-2.5
                    top-1/2
                    -translate-y-1/2
                    w-3.5
                    h-3.5
                    text-slate-400
                    pointer-events-none
                "
            />

        </div>
    );
};

/* =========================================================
   USER MODAL
========================================================= */

const UserModal = ({
    title,
    description,
    formData,
    onChange,
    onSubmit,
    onClose,
    submitText,
    isCreate = false
}) => {
    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                p-4
            "
        >

            {/* Backdrop */}

            <div
                className="
                    absolute
                    inset-0
                    bg-black/60
                    backdrop-blur-sm
                "
                onClick={onClose}
            />

            {/* Modal */}

            <div
                className="
                    relative
                    w-full
                    max-w-lg
                    bg-white
                    dark:bg-[#1F1F1F]
                    border
                    border-[#E5E1DB]
                    dark:border-[#333333]
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                "
            >

                {/* =================================================
                    MODAL HEADER
                ================================================= */}

                <div
                    className="
                        px-6
                        py-5
                        border-b
                        border-[#E5E1DB]
                        dark:border-[#2A2A2A]
                        flex
                        items-start
                        justify-between
                    "
                >

                    <div>

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                mb-1
                            "
                        >

                            <div
                                className="
                                    w-8
                                    h-8
                                    rounded-lg
                                    bg-forest-500/10
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <UserRoundPlus
                                    className="
                                        w-4
                                        h-4
                                        text-forest-500
                                    "
                                />
                            </div>

                            <h2
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                {title}
                            </h2>

                        </div>

                        <p
                            className="
                                text-[11px]
                                text-slate-400
                            "
                        >
                            {description}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            w-7
                            h-7
                            rounded-lg
                            flex
                            items-center
                            justify-center
                            text-slate-400
                            hover:text-slate-800
                            dark:hover:text-white
                            hover:bg-[#F7F5F2]
                            dark:hover:bg-[#2A2A2A]
                            transition-colors
                        "
                    >
                        <X className="w-4 h-4" />
                    </button>

                </div>

                {/* =================================================
                    FORM
                ================================================= */}

                <form onSubmit={onSubmit}>

                    <div className="p-6 space-y-4">

                        {/* Full Name */}

                        <FormField
                            label="Full Name"
                            icon={User}
                        >
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={onChange}
                                placeholder="Enter full name"
                                autoComplete="name"
                            />
                        </FormField>

                        {/* Email */}

                        <FormField
                            label="Email Address"
                            icon={Mail}
                        >
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={onChange}
                                placeholder="name@solarix.com"
                                autoComplete="email"
                            />
                        </FormField>

                        {/* Password */}

                        {isCreate && (
                            <FormField
                                label="Password"
                                icon={Lock}
                            >
                                <input
                                    required
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={onChange}
                                    placeholder="Create password"
                                    autoComplete="new-password"
                                />
                            </FormField>
                        )}

                        {/* Account Type */}

                        <FormField
                            label="Account Type"
                            icon={ShieldCheck}
                        >
                            <select
                                name="accountType"
                                value={formData.accountType}
                                onChange={onChange}
                                className="
                                    appearance-none
                                    cursor-pointer
                                "
                            >
                                <option value="Admin">
                                    Admin
                                </option>

                                <option value="Manager">
                                    Manager
                                </option>

                                <option value="Operator">
                                    Operator
                                </option>

                                <option value="Technician">
                                    Technician
                                </option>

                                <option value="Viewer">
                                    Viewer
                                </option>

                            </select>
                        </FormField>

                        {/* Status */}

                        <FormField
                            label="Account Status"
                            icon={Power}
                        >
                            <select
                                name="status"
                                value={formData.status}
                                onChange={onChange}
                                className="
                                    appearance-none
                                    cursor-pointer
                                "
                            >
                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>

                            </select>
                        </FormField>

                    </div>

                    {/* =================================================
                        MODAL FOOTER
                    ================================================= */}

                    <div
                        className="
                            px-6
                            py-4
                            bg-[#FAF9F7]
                            dark:bg-[#232323]
                            border-t
                            border-[#E5E1DB]
                            dark:border-[#2A2A2A]
                            flex
                            justify-end
                            gap-2
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                px-4
                                py-2.5
                                rounded-xl
                                text-xs
                                font-semibold
                                text-slate-500
                                hover:text-slate-800
                                dark:hover:text-white
                                transition-colors
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="
                                px-4
                                py-2.5
                                rounded-xl
                                bg-forest-500
                                hover:bg-forest-600
                                text-white
                                text-xs
                                font-semibold
                                transition-colors
                            "
                        >
                            {submitText}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

/* =========================================================
   FORM FIELD
========================================================= */

const FormField = ({
    label,
    icon: Icon,
    children
}) => {

    const inputClasses = `
        w-full
        pl-9
        pr-3
        py-2.5
        rounded-xl
        bg-[#F7F5F2]
        dark:bg-[#262626]
        border
        border-[#E5E1DB]
        dark:border-[#333333]
        text-xs
        text-slate-800
        dark:text-white
        placeholder:text-slate-400
        focus:outline-none
        focus:ring-1
        focus:ring-forest-500
    `;

    return (
        <div>

            <label
                className="
                    block
                    text-[10px]
                    uppercase
                    tracking-wider
                    font-semibold
                    text-slate-500
                    mb-1.5
                "
            >
                {label}
            </label>

            <div className="relative">

                <Icon
                    className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        w-3.5
                        h-3.5
                        text-slate-400
                        pointer-events-none
                    "
                />

                {React.cloneElement(
                    children,
                    {
                        className: `
                            ${inputClasses}
                            ${children.props.className || ''}
                        `
                    }
                )}

            </div>

        </div>
    );
};

export default UserManagement;