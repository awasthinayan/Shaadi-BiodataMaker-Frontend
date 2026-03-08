import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useGetAllBiodata, useDeleteBiodata } from '../Hooks/UseBiodata';

const TEMPLATE_NAMES = {
  1: 'Classic Royal',
  2: 'Modern Minimal',
  3: 'Floral Elegant',
};

const TEMPLATE_COLORS = {
  1: 'from-rose-900 to-red-800',
  2: 'from-blue-900 to-blue-700',
  3: 'from-amber-700 to-orange-600',
};

const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: -10,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'backOut' },
  }),
};

function StatCard({ icon, label, value, index }) {
  return (
    <motion.div
      custom={index}
      variants={statsVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4 shadow-sm border border-stone-100"
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-stone-800 leading-none">{value}</p>
        <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest">{label}</p>
      </div>
    </motion.div>
  );
}

function EmptyState({ onCreateClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'backOut' }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, -8, 0] }}
        transition={{ delay: 0.6, duration: 0.6, ease: 'easeInOut' }}
        className="text-7xl mb-6"
      >
        💍
      </motion.div>
      <h3 className="text-2xl font-semibold text-stone-700 mb-2">No Biodata Yet</h3>
      <p className="text-stone-400 mb-8 max-w-xs">
        Create your first marriage biodata and find your perfect match.
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCreateClick}
        className="bg-rose-800 hover:bg-rose-900 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 shadow-lg shadow-rose-900/20"
      >
        + Create Biodata
      </motion.button>
    </motion.div>
  );
}

function DeleteModal({ name, onConfirm, onCancel, isDeleting }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: 'backOut' }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-3">🗑️</div>
        <h3 className="text-lg font-bold text-stone-800 mb-1">Delete Biodata?</h3>
        <p className="text-stone-500 text-sm mb-6">
          "<span className="font-medium text-stone-700">{name}</span>" will be permanently deleted.
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BiodataCard({ bio, onEdit, onPreview, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const gradientClass = TEMPLATE_COLORS[bio.selectedTemplate] || TEMPLATE_COLORS[1];

  return (
    <motion.div
      variants={cardVariants}
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 flex flex-col group"
      style={{ willChange: 'transform' }}
    >
      <div className="relative h-48 overflow-hidden">
        {bio.personal?.profilePhoto ? (
          <motion.img
            src={bio.personal.profilePhoto}
            alt={bio.personal?.fullName}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <motion.span
              animate={{ scale: hovered ? 1.15 : 1 }}
              transition={{ duration: 0.4 }}
              className="text-5xl opacity-60"
            >
              💍
            </motion.span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
          bio.isComplete
            ? 'bg-emerald-500/90 text-white'
            : 'bg-amber-400/90 text-amber-900'
        }`}>
          {bio.isComplete ? '✓ Complete' : 'Draft'}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg">
            {bio.personal?.fullName || 'Unnamed'}
          </h3>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
            {TEMPLATE_NAMES[bio.selectedTemplate] || 'Classic Royal'}
          </span>
          <span className="text-xs text-stone-400">
            {new Date(bio.updatedAt).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </span>
        </div>

        {bio.title && (
          <p className="text-sm text-stone-500 truncate">{bio.title}</p>
        )}

        <div className="flex gap-2 mt-auto pt-2 border-t border-stone-100">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onEdit}
            className="flex-1 py-2 text-xs font-semibold text-stone-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors duration-150 hover:cursor-pointer"
          >
            ✏️ Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onPreview}
            className="flex-1 py-2 text-xs font-semibold text-stone-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-150 hover:cursor-pointer"
          >
            👁️ Preview
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onDelete}
            className="px-3 py-2 text-xs font-semibold text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 hover:cursor-pointer"
          >
            🗑️
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: biodatas, isLoading, isError } = useGetAllBiodata();
  const { mutate: deleteBiodata, isPending: isDeleting } = useDeleteBiodata();

  const user = JSON.parse(localStorage.getItem('user') || '{}') || {};
  const totalBiodatas  = biodatas?.length || 0;
  const completedCount = biodatas?.filter((b) => b.isComplete).length || 0;
  const draftCount     = totalBiodatas - completedCount;

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteBiodata(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  return (
    <>
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            name={deleteTarget.name}
            isDeleting={isDeleting}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 lg:px-10"
      >
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl font-bold text-stone-800 tracking-tight hover:cursor-pointer"
              >
                💍 My Biodatas
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="text-stone-400 mt-1 text-sm"
              >
                Welcome back,{' '}
                <span className="text-stone-600 font-medium">{user.name || 'User'}</span>
              </motion.p>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(136,19,55,0.25)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/create')}
              className="bg-rose-800 hover:bg-rose-900 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 shadow-lg shadow-rose-900/20 whitespace-nowrap hover:cursor-pointer"
            >
              + Create New Biodata
            </motion.button>
          </div>

          {/* Stats */}
          {!isLoading && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatCard icon="📋" label="Total"    value={totalBiodatas}  index={0} />
              <StatCard icon="✅" label="Complete" value={completedCount} index={1} />
              <StatCard icon="📝" label="Drafts"   value={draftCount}     index={2} />
            </div>
          )}

          {/* Skeleton Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 hover:cursor-pointer">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                  className="h-72 bg-stone-200 rounded-2xl"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm"
            >
              Failed to load biodatas. Please refresh the page.
            </motion.div>
          )}

          {/* Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {!isLoading && biodatas?.length === 0 && (
                <EmptyState onCreateClick={() => navigate('/create')} />
              )}
              {biodatas?.map((bio) => (
                <BiodataCard
                  key={bio._id}
                  bio={bio}
                  onEdit={()    => navigate(`/edit/${bio._id}`)}
                  onPreview={()  => navigate(`/preview/${bio._id}`)}
                  onDelete={()  => setDeleteTarget({
                    id:   bio._id,
                    name: bio.personal?.fullName || bio.title || 'this biodata',
                  })}
                />
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </motion.div>
    </>
  );
}