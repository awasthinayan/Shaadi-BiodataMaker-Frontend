import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetBiodataById } from '../../Hooks/UseBiodata';

// ── Shared sub-components — defined OUTSIDE templates ────────────────────────

const T1Row = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="grid gap-1 py-1.5 border-b border-dashed border-stone-200 last:border-0"
      style={{ gridTemplateColumns: '140px 12px 1fr' }}>
      <span className="text-xs font-bold text-stone-500">{label}</span>
      <span className="text-stone-300">:</span>
      <span className="text-sm text-stone-800">{value}</span>
    </div>
  );
};

const T1Section = ({ title, color, children }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-2 pb-1.5" style={{ borderBottom: `2px solid ${color}` }}>
      <span style={{ color }} className="text-xs">✦</span>
      <h3 className="text-xs font-black uppercase tracking-widest" style={{ color }}>{title}</h3>
      <span style={{ color }} className="text-xs">✦</span>
    </div>
    {children}
  </div>
);

const T2Field = ({ label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-widest font-bold text-stone-400">{label}</span>
      <span className="text-sm text-stone-800">{value}</span>
    </div>
  );
};

const T2Section = ({ title, color, children }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      <h3 className="text-xs font-black uppercase tracking-widest" style={{ color }}>{title}</h3>
      <div className="flex-1 h-px" style={{ background: color, opacity: 0.2 }} />
    </div>
    <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>
  </div>
);

const T3Row = ({ label, value, color }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex gap-1 text-sm py-1">
      <span className="font-bold w-28 flex-shrink-0" style={{ color }}>{label}</span>
      <span className="text-stone-400">:</span>
      <span className="text-stone-700 flex-1">{value}</span>
    </div>
  );
};

const T3Section = ({ title, color, children }) => (
  <div className="mb-5">
    <h3 className="text-sm font-bold mb-2" style={{ color }}>{title}</h3>
    <div className="h-px mb-3 opacity-30" style={{ background: color }} />
    <div className="grid grid-cols-2 gap-x-6">{children}</div>
  </div>
);

// ── Template 1: Classic Royal ─────────────────────────────────────────────────
function Template1({ data, customization, privacy }) {
  const { personal, contact, family, education, profession, horoscope } = data;
  const color = customization?.primaryColor || '#8B0000';

  const siblings = [
    family.brothers > 0 && `${family.brothers} Brother${family.brothers > 1 ? 's' : ''} (${family.brothersMarried} Married)`,
    family.sisters > 0  && `${family.sisters} Sister${family.sisters > 1 ? 's' : ''} (${family.sistersMarried} Married)`,
  ].filter(Boolean).join(', ');

  return (
    <div className="bg-white font-serif" style={{ border: `3px solid ${color}`, maxWidth: 760, margin: '0 auto' }}>
      <div className="text-center py-6 px-8" style={{ background: color }}>
        <p className="text-white/70 text-xs tracking-widest mb-2">॥ विवाह हेतु बायोडाटा ॥</p>
        <h1 className="text-white text-3xl font-bold tracking-wide">{personal.fullName || 'Full Name'}</h1>
        <p className="text-white/70 text-sm mt-1">{personal.religion}{personal.caste ? ` · ${personal.caste}` : ''}</p>
      </div>

      <div className="p-6">
        <div className="flex gap-5 mb-5">
          {personal.profilePhoto && (
            <img src={personal.profilePhoto} alt="Profile"
              className="w-32 h-40 object-cover flex-shrink-0"
              style={{ border: `3px solid ${color}` }} />
          )}
          <div className="flex-1">
            <T1Section title="Personal Information" color={color}>
              <T1Row label="Date of Birth" value={personal.dateOfBirth ? new Date(personal.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''} />
              <T1Row label="Age"            value={personal.age ? `${personal.age} Years` : ''} />
              <T1Row label="Height / Weight" value={[personal.height, personal.weight].filter(Boolean).join(' / ')} />
              <T1Row label="Complexion"     value={personal.complexion} />
              <T1Row label="Blood Group"    value={personal.bloodGroup} />
              <T1Row label="Marital Status" value={personal.maritalStatus} />
              <T1Row label="Caste / Gotra"  value={[personal.caste, family.gotra].filter(Boolean).join(' / ')} />
              <T1Row label="Mother Tongue"  value={personal.motherTongue} />
            </T1Section>
          </div>
        </div>

        <T1Section title="Education & Profession" color={color}>
          <T1Row label="Qualification"  value={education.highestQualification} />
          <T1Row label="Field of Study" value={education.fieldOfStudy} />
          <T1Row label="University"     value={education.university} />
          <T1Row label="Designation"    value={profession.designation} />
          <T1Row label="Organisation"   value={profession.organization} />
          <T1Row label="Work Location"  value={profession.workLocation} />
          {privacy?.showIncome && <T1Row label="Annual Income" value={profession.annualIncome} />}
        </T1Section>

        <T1Section title="Family Details" color={color}>
          <T1Row label="Father"       value={family.fatherName ? `${family.fatherName} (${family.fatherOccupation || 'N/A'})` : ''} />
          <T1Row label="Mother"       value={family.motherName ? `${family.motherName} (${family.motherOccupation || 'N/A'})` : ''} />
          <T1Row label="Siblings"     value={siblings || 'None'} />
          <T1Row label="Family Type"  value={`${family.familyType} · ${family.familyStatus}`} />
          <T1Row label="Native Place" value={family.nativePlace} />
        </T1Section>

        {privacy?.showHoroscope && horoscope?.isEnabled && (
          <T1Section title="Horoscope Details" color={color}>
            <T1Row label="Rashi"     value={horoscope.rashi} />
            <T1Row label="Nakshatra" value={horoscope.nakshatra} />
            <T1Row label="Manglik"   value={horoscope.manglik} />
          </T1Section>
        )}

        {privacy?.showContactDetails && (
          <T1Section title="Contact Details" color={color}>
            <T1Row label="Mobile"  value={contact.mobile} />
            <T1Row label="Email"   value={contact.email} />
            <T1Row label="City"    value={`${contact.city}${contact.state ? ', ' + contact.state : ''}`} />
            <T1Row label="Address" value={contact.address} />
          </T1Section>
        )}
      </div>

      <div className="text-center py-3 text-white/80 text-sm" style={{ background: color }}>
        ॥ शुभ विवाह ॥
      </div>
    </div>
  );
}

// ── Template 2: Modern Minimal ────────────────────────────────────────────────
function Template2({ data, customization, privacy }) {
  const { personal, contact, family, education, profession, horoscope } = data;
  const color = customization?.primaryColor || '#1a5276';

  return (
    <div className="bg-white flex" style={{ maxWidth: 800, margin: '0 auto', minHeight: 900 }}>
      <div className="w-52 flex-shrink-0 flex flex-col items-center py-8 px-4" style={{ background: color }}>
        {personal.profilePhoto
          ? <img src={personal.profilePhoto} alt="Profile" className="w-28 h-36 object-cover rounded-lg mb-4 border-2 border-white/30" />
          : <div className="w-28 h-36 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-white/40 text-sm">No Photo</div>
        }
        <h2 className="text-white font-bold text-center text-base leading-tight mb-2">{personal.fullName || 'Full Name'}</h2>
        <span className="text-white/60 text-xs bg-white/10 px-3 py-1 rounded-full mb-6">{personal.maritalStatus}</span>
        <div className="w-full space-y-2 text-white/80 text-xs">
          {personal.age        && <div className="flex items-center gap-2"><span>🎂</span>{personal.age} yrs</div>}
          {personal.height     && <div className="flex items-center gap-2"><span>📏</span>{personal.height}</div>}
          {personal.religion   && <div className="flex items-center gap-2"><span>🙏</span>{personal.religion}</div>}
          {personal.bloodGroup && <div className="flex items-center gap-2"><span>🩸</span>{personal.bloodGroup}</div>}
          {contact.city        && <div className="flex items-center gap-2"><span>📍</span>{contact.city}</div>}
        </div>
        {privacy?.showContactDetails && (
          <div className="w-full mt-6 pt-4 border-t border-white/20 space-y-2 text-white/70 text-xs">
            {contact.mobile && <div className="flex items-center gap-2 break-all"><span>📱</span>{contact.mobile}</div>}
            {contact.email  && <div className="flex items-center gap-2 break-all"><span>✉️</span>{contact.email}</div>}
          </div>
        )}
      </div>

      <div className="flex-1 p-7 overflow-hidden">
        <div className="h-1.5 rounded-full mb-6" style={{ background: color }} />

        <T2Section title="Personal Details" color={color}>
          <T2Field label="Date of Birth" value={personal.dateOfBirth ? new Date(personal.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''} />
          <T2Field label="Complexion"    value={personal.complexion} />
          <T2Field label="Caste"         value={personal.caste} />
          <T2Field label="Gotra"         value={family.gotra} />
          <T2Field label="Mother Tongue" value={personal.motherTongue} />
          <T2Field label="Nationality"   value={personal.nationality} />
        </T2Section>

        <T2Section title="Education & Career" color={color}>
          <T2Field label="Qualification" value={education.highestQualification} />
          <T2Field label="Field"         value={education.fieldOfStudy} />
          <T2Field label="University"    value={education.university} />
          <T2Field label="Designation"   value={profession.designation} />
          <T2Field label="Organisation"  value={profession.organization} />
          {privacy?.showIncome && <T2Field label="Income" value={profession.annualIncome} />}
        </T2Section>

        <T2Section title="Family Background" color={color}>
          <T2Field label="Father"   value={family.fatherName ? `${family.fatherName} (${family.fatherOccupation})` : ''} />
          <T2Field label="Mother"   value={family.motherName ? `${family.motherName} (${family.motherOccupation})` : ''} />
          <T2Field label="Brothers" value={family.brothers > 0 ? `${family.brothers} (${family.brothersMarried} married)` : 'None'} />
          <T2Field label="Sisters"  value={family.sisters > 0 ? `${family.sisters} (${family.sistersMarried} married)` : 'None'} />
          <T2Field label="Family Type"  value={family.familyType} />
          <T2Field label="Native Place" value={family.nativePlace} />
        </T2Section>

        {privacy?.showHoroscope && horoscope?.isEnabled && (
          <T2Section title="Horoscope" color={color}>
            <T2Field label="Rashi"     value={horoscope.rashi} />
            <T2Field label="Nakshatra" value={horoscope.nakshatra} />
            <T2Field label="Manglik"   value={horoscope.manglik} />
          </T2Section>
        )}
      </div>
    </div>
  );
}

// ── Template 3: Floral Elegant ────────────────────────────────────────────────
function Template3({ data, customization, privacy }) {
  const { personal, contact, family, education, profession, horoscope } = data;
  const color = customization?.primaryColor || '#8b4513';

  return (
    <div className="bg-amber-50 font-serif" style={{ maxWidth: 760, margin: '0 auto', border: `2px solid ${color}` }}>
      <div className="text-center py-2 text-lg tracking-widest" style={{ background: color, color: 'rgba(255,255,255,0.8)' }}>
        ❋ ✿ ❋ ✿ ❋ ✿ ❋ ✿ ❋
      </div>

      <div className="p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px opacity-30" style={{ background: color }} />
          <h1 className="text-xl font-bold tracking-widest uppercase" style={{ color }}>Marriage Biodata</h1>
          <div className="flex-1 h-px opacity-30" style={{ background: color }} />
        </div>

        <div className="flex gap-5 mb-6 p-4 rounded-xl border" style={{ background: 'rgba(255,248,240,0.8)', borderColor: `${color}33` }}>
          {personal.profilePhoto
            ? <img src={personal.profilePhoto} alt="Profile" className="w-28 h-36 object-cover flex-shrink-0" style={{ border: `3px solid ${color}` }} />
            : <div className="w-28 h-36 flex-shrink-0 flex items-center justify-center text-xs" style={{ border: `2px dashed ${color}`, color, background: `${color}10` }}>Photo</div>
          }
          <div className="flex-1">
            <h2 className="text-2xl font-bold" style={{ color }}>{personal.fullName || 'Full Name'}</h2>
            <p className="text-stone-500 text-sm mt-1">{personal.religion}{personal.caste ? `, ${personal.caste}` : ''}</p>
            {personal.age && <p className="text-stone-500 text-sm italic mt-1">{personal.age} Years Old</p>}
            <div className="mt-3 space-y-1">
              {personal.height     && <p className="text-sm text-stone-600">📏 {personal.height}</p>}
              {personal.bloodGroup && <p className="text-sm text-stone-600">🩸 {personal.bloodGroup}</p>}
              {contact.city        && <p className="text-sm text-stone-600">📍 {contact.city}{contact.state ? `, ${contact.state}` : ''}</p>}
            </div>
          </div>
        </div>

        <T3Section title="🌸 Personal Details" color={color}>
          <T3Row color={color} label="Date of Birth"  value={personal.dateOfBirth ? new Date(personal.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''} />
          <T3Row color={color} label="Complexion"     value={personal.complexion} />
          <T3Row color={color} label="Marital Status" value={personal.maritalStatus} />
          <T3Row color={color} label="Mother Tongue"  value={personal.motherTongue} />
          <T3Row color={color} label="Caste"          value={personal.caste} />
          <T3Row color={color} label="Gotra"          value={family.gotra} />
        </T3Section>

        <T3Section title="🌸 Education & Profession" color={color}>
          <T3Row color={color} label="Qualification" value={education.highestQualification} />
          <T3Row color={color} label="Field"         value={education.fieldOfStudy} />
          <T3Row color={color} label="University"    value={education.university} />
          <T3Row color={color} label="Designation"   value={profession.designation} />
          <T3Row color={color} label="Organisation"  value={profession.organization} />
          {privacy?.showIncome && <T3Row color={color} label="Income" value={profession.annualIncome} />}
        </T3Section>

        <T3Section title="🌸 Family Details" color={color}>
          <T3Row color={color} label="Father"      value={family.fatherName ? `${family.fatherName} (${family.fatherOccupation})` : ''} />
          <T3Row color={color} label="Mother"      value={family.motherName ? `${family.motherName} (${family.motherOccupation})` : ''} />
          <T3Row color={color} label="Brothers"    value={family.brothers > 0 ? `${family.brothers} (${family.brothersMarried} married)` : ''} />
          <T3Row color={color} label="Sisters"     value={family.sisters > 0 ? `${family.sisters} (${family.sistersMarried} married)` : ''} />
          <T3Row color={color} label="Family Type" value={family.familyType} />
          <T3Row color={color} label="Native Place" value={family.nativePlace} />
        </T3Section>

        {privacy?.showHoroscope && horoscope?.isEnabled && (
          <T3Section title="🌸 Horoscope" color={color}>
            <T3Row color={color} label="Rashi"     value={horoscope.rashi} />
            <T3Row color={color} label="Nakshatra" value={horoscope.nakshatra} />
            <T3Row color={color} label="Manglik"   value={horoscope.manglik} />
          </T3Section>
        )}

        {privacy?.showContactDetails && (
          <T3Section title="🌸 Contact" color={color}>
            <T3Row color={color} label="Mobile"  value={contact.mobile} />
            <T3Row color={color} label="Email"   value={contact.email} />
            <T3Row color={color} label="Address" value={contact.address} />
          </T3Section>
        )}
      </div>

      <div className="text-center py-2 text-lg tracking-widest" style={{ background: color, color: 'rgba(255,255,255,0.8)' }}>
        ❋ ✿ ❋ ✿ ❋ ✿ ❋ ✿ ❋
      </div>
    </div>
  );
}

const TEMPLATES = { 1: Template1, 2: Template2, 3: Template3 };

// ── Main Preview Page ─────────────────────────────────────────────────────────
export default function PreviewBiodata() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const { data: biodata, isLoading, isError } = useGetBiodataById(id);

  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      html2pdf()
        .set({
          margin:      [8, 8, 8, 8],
          filename:    `${biodata?.personal?.fullName || 'biodata'}_biodata.pdf`,
          image:       { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(printRef.current)
        .save();
    } catch {
      alert('PDF generation failed. Run: yarn add html2pdf.js');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-full mx-auto mb-3"
            style={{ border: '3px solid #e7e5e4', borderTopColor: '#9f1239' }}
          />
          <p className="text-stone-400 text-sm">Loading biodata…</p>
        </div>
      </div>
    );
  }

  if (isError || !biodata) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Could not load this biodata.</p>
          <button onClick={() => navigate('/dashboard')} className="text-rose-700 font-semibold hover:underline">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const TemplateComponent = TEMPLATES[biodata.selectedTemplate] || Template1;

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Action Bar */}
      <div className="print:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 text-sm font-medium transition-colors hover:cursor-pointer">
          ← Back
        </button>
        <h1 className="text-sm font-bold text-stone-700 truncate max-w-xs">
          {biodata.personal?.fullName || 'Biodata Preview'}
        </h1>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate(`/edit/${id}`)}
            className="px-3 py-1.5 text-xs font-semibold text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors hover:cursor-pointer">
            ✏️ Edit
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors hover:cursor-pointer">
            🖨️ Print
          </motion.button>
          {/* <motion.button whileTap={{ scale: 0.97 }} onClick={handleDownloadPDF}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-800 hover:bg-rose-900 text-white rounded-lg transition-colors shadow-sm">
            ⬇️ PDF
          </motion.button> */}
        </div>
      </div>

      {/* Template */}
      <div className="py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          ref={printRef}
          className="shadow-2xl"
        >
          <TemplateComponent
            data={biodata}
            customization={biodata.templateCustomization}
            privacy={biodata.privacy}
          />
        </motion.div>
      </div>
    </div>
  );
}