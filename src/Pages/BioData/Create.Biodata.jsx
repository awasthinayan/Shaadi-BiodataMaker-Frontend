import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateBiodata, useUpdateBiodata, useGetBiodataById } from '../../Hooks/UseBiodata';

// ── Default empty form state ──────────────────────────────────────────────────
const emptyForm = {
  title: 'My Biodata',
  personal: {
    fullName: '', dateOfBirth: '', age: '', timeOfBirth: '',
    placeOfBirth: '', gender: 'Male', height: '', weight: '',
    complexion: '', maritalStatus: 'Never Married', religion: '',
    caste: '', subCaste: '', motherTongue: '', nationality: 'Indian',
    bloodGroup: '', profilePhoto: '',
  },
  contact: {
    address: '', city: '', state: '', pincode: '',
    mobile: '', email: '', alternateContact: '',
  },
  family: {
    fatherName: '', fatherOccupation: '', motherName: '', motherOccupation: '',
    brothers: 0, brothersMarried: 0, sisters: 0, sistersMarried: 0,
    familyType: 'Nuclear', familyStatus: 'Middle Class',
    familyValues: 'Moderate', nativePlace: '', gotra: '',
  },
  education: {
    highestQualification: '', fieldOfStudy: '', university: '',
    yearOfCompletion: '', additionalQualifications: '',
  },
  profession: {
    employmentType: 'Employed', designation: '', organization: '',
    workLocation: '', annualIncome: '', workExperience: '',
  },
  horoscope: {
    isEnabled: false, rashi: '', nakshatra: '',
    gotra: '', manglik: 'No', chartType: 'North Indian',
  },
  preferences: {
    ageFrom: '', ageTo: '', heightFrom: '', heightTo: '',
    religion: '', caste: '', education: '', profession: '',
    location: '', otherExpectations: '',
  },
  selectedTemplate: 1,
  templateCustomization: { primaryColor: '#8B0000', fontFamily: '"Playfair Display", serif' },
  privacy: { showContactDetails: true, showHoroscope: true, showIncome: false },
};

const STEPS = [
  { id: 0, label: 'Personal',    icon: '👤' },
  { id: 1, label: 'Contact',     icon: '📞' },
  { id: 2, label: 'Family',      icon: '👨‍👩‍👧' },
  { id: 3, label: 'Education',   icon: '🎓' },
  { id: 4, label: 'Horoscope',   icon: '⭐' },
  { id: 5, label: 'Preferences', icon: '💑' },
  { id: 6, label: 'Template',    icon: '🎨' },
];

// ── Per-step validation rules ─────────────────────────────────────────────────
const validateStep = (step, form) => {
  const errors = {};
  if (step === 0) {
    if (!form.personal.fullName?.trim())    errors.fullName    = 'Full name is required';
    if (!form.personal.dateOfBirth)         errors.dateOfBirth = 'Date of birth is required';
    if (!form.personal.religion?.trim())    errors.religion    = 'Religion is required';
  }
  if (step === 1) {
    if (!form.contact.mobile?.trim())       errors.mobile      = 'Mobile number is required';
    if (!/^\d{10}$/.test(form.contact.mobile?.trim())) errors.mobile = 'Enter a valid 10-digit number';
    if (!form.contact.city?.trim())         errors.city        = 'City is required';
  }
  if (step === 3) {
    if (!form.education.highestQualification) errors.highestQualification = 'Qualification is required';
  }
  return errors;
};

// ── Reusable field components ─────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">{label}</label>
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-red-500 font-medium flex items-center gap-1"
      >
        ⚠ {error}
      </motion.p>
    )}
  </div>
);

const errCls   = "w-full px-3 py-2.5 rounded-xl border border-red-400 bg-red-50 text-stone-800 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all duration-150";
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all duration-150";
const selectCls = "w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-rose-400 focus:bg-white focus:ring-2 focus:ring-rose-100 transition-all duration-150";

const inp  = (err) => err ? errCls : inputCls;
const sel  = (err) => err ? `${errCls} cursor-pointer` : `${selectCls} cursor-pointer`;

// ── Step 0: Personal ──────────────────────────────────────────────────────────
function PersonalStep({ data, onChange, errors }) {
  const set = (f) => (e) => onChange({ ...data, [f]: e.target.value });

  const handleDOB = (e) => {
    const dob = e.target.value;
    let age = '';
    if (dob) {
      const birth = new Date(dob);
      const now = new Date();
      age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
      if (age < 0) age = '';
    }
    onChange({ ...data, dateOfBirth: dob, age });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('Image must be under 5MB');
    const previewUrl = URL.createObjectURL(file);
    onChange({ ...data, profilePhoto: file, profilePhotoPreview: previewUrl });
  };

  return (
    <div className="space-y-6">
      {/* Photo upload */}
      <div className="flex flex-col items-center gap-3">
        <div
          onClick={() => document.getElementById('photo-input').click()}
          className="w-32 h-36 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center cursor-pointer overflow-hidden hover:border-rose-400 transition-colors"
        >
          {data.profilePhoto
            ? <img src={data.profilePhotoPreview || (typeof data.profilePhoto === 'string' ? data.profilePhoto : '')} alt="Profile" className="w-full h-full object-cover" />
            : <div className="text-center p-3"><div className="text-3xl mb-1">📷</div><p className="text-xs text-stone-400">Upload Photo</p></div>
          }
        </div>
        <input id="photo-input" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        {data.profilePhoto && (
          <button onClick={() => onChange({ ...data, profilePhoto: '', profilePhotoPreview: '' })}
            className="text-xs text-red-500 hover:text-red-700 cursor-pointer">Remove photo</button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name *" error={errors?.fullName}>
          <input className={inp(errors?.fullName)} value={data.fullName} onChange={set('fullName')} placeholder="Enter full name" />
        </Field>
        <Field label="Date of Birth *" error={errors?.dateOfBirth}>
          <input type="date" className={inp(errors?.dateOfBirth)} value={data.dateOfBirth} onChange={handleDOB} />
        </Field>
        <Field label="Age (auto-calculated)">
          <input className={`${inputCls} bg-stone-100 cursor-not-allowed`} value={data.age} readOnly placeholder="Auto-filled" />
        </Field>
        <Field label="Gender">
          <select className={sel()} value={data.gender} onChange={set('gender')}>
            {['Male','Female','Other'].map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Marital Status">
          <select className={sel()} value={data.maritalStatus} onChange={set('maritalStatus')}>
            {['Never Married','Divorced','Widowed','Awaiting Divorce'].map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Blood Group">
          <select className={sel()} value={data.bloodGroup} onChange={set('bloodGroup')}>
            <option value="">Select</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Height">
          <input className={inputCls} value={data.height} onChange={set('height')} placeholder="e.g. 5'7" />
        </Field>
        <Field label="Weight">
          <input className={inputCls} value={data.weight} onChange={set('weight')} placeholder="e.g. 65 kg" />
        </Field>
        <Field label="Complexion">
          <select className={sel()} value={data.complexion} onChange={set('complexion')}>
            <option value="">Select</option>
            {['Fair','Wheatish','Wheatish Brown','Dark','Very Fair'].map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Religion *" error={errors?.religion}>
          <input className={inp(errors?.religion)} value={data.religion} onChange={set('religion')} placeholder="e.g. Hindu" />
        </Field>
        <Field label="Caste">
          <input className={inputCls} value={data.caste} onChange={set('caste')} placeholder="Enter caste" />
        </Field>
        <Field label="Mother Tongue">
          <input className={inputCls} value={data.motherTongue} onChange={set('motherTongue')} placeholder="e.g. Hindi" />
        </Field>
      </div>
    </div>
  );
}

// ── Step 1: Contact ───────────────────────────────────────────────────────────
function ContactStep({ data, onChange, errors }) {
  const set = (f) => (e) => onChange({ ...data, [f]: e.target.value });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Mobile Number *" error={errors?.mobile}>
        <input className={inp(errors?.mobile)} value={data.mobile} onChange={set('mobile')} placeholder="10-digit number" maxLength={10} />
      </Field>
      <Field label="Email">
        <input type="email" className={inputCls} value={data.email} onChange={set('email')} placeholder="email@example.com" />
      </Field>
      <Field label="Alternate Contact">
        <input className={inputCls} value={data.alternateContact} onChange={set('alternateContact')} placeholder="Optional" />
      </Field>
      <Field label="City *" error={errors?.city}>
        <input className={inp(errors?.city)} value={data.city} onChange={set('city')} placeholder="Your city" />
      </Field>
      <Field label="State">
        <input className={inputCls} value={data.state} onChange={set('state')} placeholder="Your state" />
      </Field>
      <Field label="Pincode">
        <input className={inputCls} value={data.pincode} onChange={set('pincode')} placeholder="6-digit pincode" maxLength={6} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Address">
          <textarea className={inputCls} rows={3} value={data.address} onChange={set('address')} placeholder="Full address" />
        </Field>
      </div>
    </div>
  );
}

// ── Step 2: Family ────────────────────────────────────────────────────────────
function FamilyStep({ data, onChange }) {
  const set = (f) => (e) => onChange({ ...data, [f]: e.target.value });
  const setNum = (f) => (e) => onChange({ ...data, [f]: Number(e.target.value) });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Father's Name"><input className={inputCls} value={data.fatherName} onChange={set('fatherName')} placeholder="Father's full name" /></Field>
      <Field label="Father's Occupation"><input className={inputCls} value={data.fatherOccupation} onChange={set('fatherOccupation')} placeholder="Occupation" /></Field>
      <Field label="Mother's Name"><input className={inputCls} value={data.motherName} onChange={set('motherName')} placeholder="Mother's full name" /></Field>
      <Field label="Mother's Occupation"><input className={inputCls} value={data.motherOccupation} onChange={set('motherOccupation')} placeholder="Occupation" /></Field>
      <Field label="Native Place"><input className={inputCls} value={data.nativePlace} onChange={set('nativePlace')} placeholder="Native place" /></Field>
      <Field label="Gotra"><input className={inputCls} value={data.gotra} onChange={set('gotra')} placeholder="Gotra" /></Field>
      <Field label="Family Type">
        <select className={`${selectCls} cursor-pointer`} value={data.familyType} onChange={set('familyType')}>
          {['Nuclear','Joint','Extended'].map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Family Status">
        <select className={`${selectCls} cursor-pointer`} value={data.familyStatus} onChange={set('familyStatus')}>
          {['Middle Class','Upper Middle Class','Rich','Affluent'].map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Family Values">
        <select className={`${selectCls} cursor-pointer`} value={data.familyValues} onChange={set('familyValues')}>
          {['Traditional','Moderate','Liberal'].map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <div className="sm:col-span-2 grid grid-cols-2 gap-4">
        <Field label="Brothers">
          <div className="flex gap-2">
            <input type="number" min="0" max="10" className={inputCls} value={data.brothers} onChange={setNum('brothers')} placeholder="Total" />
            <input type="number" min="0" max={data.brothers} className={inputCls} value={data.brothersMarried} onChange={setNum('brothersMarried')} placeholder="Married" />
          </div>
        </Field>
        <Field label="Sisters">
          <div className="flex gap-2">
            <input type="number" min="0" max="10" className={inputCls} value={data.sisters} onChange={setNum('sisters')} placeholder="Total" />
            <input type="number" min="0" max={data.sisters} className={inputCls} value={data.sistersMarried} onChange={setNum('sistersMarried')} placeholder="Married" />
          </div>
        </Field>
      </div>
    </div>
  );
}

// ── Step 3: Education & Profession ────────────────────────────────────────────
function EducationStep({ education, profession, onEdu, onProf, errors }) {
  const setE = (f) => (e) => onEdu({ ...education, [f]: e.target.value });
  const setP = (f) => (e) => onProf({ ...profession, [f]: e.target.value });
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-stone-600 mb-3 flex items-center gap-2">🎓 Education</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Highest Qualification *" error={errors?.highestQualification}>
            <select className={sel(errors?.highestQualification)} value={education.highestQualification} onChange={setE('highestQualification')}>
              <option value="">Select</option>
              {['10th','12th','Diploma','B.A.','B.Sc.','B.Com.','B.E./B.Tech.','M.B.A.','M.E./M.Tech.','M.B.B.S.','Ph.D.','Other'].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Field of Study"><input className={inputCls} value={education.fieldOfStudy} onChange={setE('fieldOfStudy')} placeholder="e.g. Computer Science" /></Field>
          <Field label="University / College"><input className={inputCls} value={education.university} onChange={setE('university')} placeholder="University name" /></Field>
          <Field label="Year of Completion"><input className={inputCls} value={education.yearOfCompletion} onChange={setE('yearOfCompletion')} placeholder="e.g. 2022" /></Field>
          <div className="sm:col-span-2">
            <Field label="Additional Qualifications">
              <textarea className={inputCls} rows={2} value={education.additionalQualifications} onChange={setE('additionalQualifications')} placeholder="e.g. CA, certifications..." />
            </Field>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-stone-600 mb-3 flex items-center gap-2">💼 Profession</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Employment Type">
            <select className={`${selectCls} cursor-pointer`} value={profession.employmentType} onChange={setP('employmentType')}>
              {['Employed','Self-Employed','Business','Government','Not Working'].map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Designation"><input className={inputCls} value={profession.designation} onChange={setP('designation')} placeholder="Job title" /></Field>
          <Field label="Organisation"><input className={inputCls} value={profession.organization} onChange={setP('organization')} placeholder="Company name" /></Field>
          <Field label="Work Location"><input className={inputCls} value={profession.workLocation} onChange={setP('workLocation')} placeholder="City / Remote" /></Field>
          <Field label="Annual Income"><input className={inputCls} value={profession.annualIncome} onChange={setP('annualIncome')} placeholder="e.g. 8 LPA" /></Field>
          <Field label="Experience"><input className={inputCls} value={profession.workExperience} onChange={setP('workExperience')} placeholder="e.g. 3 years" /></Field>
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Horoscope ─────────────────────────────────────────────────────────
function HoroscopeStep({ data, onChange }) {
  const set = (f) => (e) => onChange({ ...data, [f]: e.target.value });
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
        <div>
          <p className="font-semibold text-stone-700">Include Horoscope</p>
          <p className="text-xs text-stone-400 mt-0.5">Add horoscope details to your biodata</p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...data, isEnabled: !data.isEnabled })}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${data.isEnabled ? 'bg-rose-700' : 'bg-stone-300'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${data.isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>
      <AnimatePresence>
        {data.isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
          >
            <Field label="Rashi (Moon Sign)">
              <select className={`${selectCls} cursor-pointer`} value={data.rashi} onChange={set('rashi')}>
                <option value="">Select Rashi</option>
                {['Mesh (Aries)','Vrishabh (Taurus)','Mithun (Gemini)','Karka (Cancer)','Simha (Leo)','Kanya (Virgo)','Tula (Libra)','Vrishchika (Scorpio)','Dhanu (Sagittarius)','Makar (Capricorn)','Kumbha (Aquarius)','Meena (Pisces)'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Nakshatra">
              <select className={`${selectCls} cursor-pointer`} value={data.nakshatra} onChange={set('nakshatra')}>
                <option value="">Select Nakshatra</option>
                {['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Shravana','Revati'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Gotra"><input className={inputCls} value={data.gotra} onChange={set('gotra')} placeholder="Enter gotra" /></Field>
            <Field label="Manglik">
              <select className={`${selectCls} cursor-pointer`} value={data.manglik} onChange={set('manglik')}>
                {['No','Yes','Partial'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Chart Type">
              <select className={`${selectCls} cursor-pointer`} value={data.chartType} onChange={set('chartType')}>
                {['North Indian','South Indian','East Indian'].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Step 5: Preferences ───────────────────────────────────────────────────────
function PreferencesStep({ data, onChange }) {
  const set = (f) => (e) => onChange({ ...data, [f]: e.target.value });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Age Range">
        <div className="flex gap-2 items-center">
          <input type="number" className={inputCls} value={data.ageFrom} onChange={set('ageFrom')} placeholder="From" min={18} />
          <span className="text-stone-400 text-sm">to</span>
          <input type="number" className={inputCls} value={data.ageTo} onChange={set('ageTo')} placeholder="To" min={18} />
        </div>
      </Field>
      <Field label="Height Range">
        <div className="flex gap-2 items-center">
          <input className={inputCls} value={data.heightFrom} onChange={set('heightFrom')} placeholder="From" />
          <span className="text-stone-400 text-sm">to</span>
          <input className={inputCls} value={data.heightTo} onChange={set('heightTo')} placeholder="To" />
        </div>
      </Field>
      {[['religion','Religion Preference'],['caste','Caste Preference'],['education','Education'],['profession','Profession'],['location','Preferred Location']].map(([f,l]) => (
        <Field key={f} label={l}><input className={inputCls} value={data[f]} onChange={set(f)} placeholder={`Any ${l.toLowerCase()}`} /></Field>
      ))}
      <div className="sm:col-span-2">
        <Field label="Other Expectations">
          <textarea className={inputCls} rows={3} value={data.otherExpectations} onChange={set('otherExpectations')} placeholder="Any other expectations from partner..." />
        </Field>
      </div>
    </div>
  );
}

// ── Step 6: Template ─────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 1,
    name: 'Classic Royal',
    desc: 'Traditional dark red with serif fonts',
    color: '#8B0000',
    preview: (name, color) => (
      <div className="w-full h-full flex flex-col text-[6px] overflow-hidden rounded-lg">
        <div className="px-2 py-2 text-center text-white" style={{ background: color }}>
          <div className="font-bold text-[7px] opacity-80">॥ विवाह हेतु बायोडाटा ॥</div>
          <div className="font-bold text-[10px] mt-0.5">{name || 'Full Name'}</div>
        </div>
        <div className="flex-1 bg-white px-2 py-1.5 space-y-1">
          {[['PERSONAL', ['Marital Status : Never Married', 'Religion : Hindu']],
            ['FAMILY', ['Father : Mr. Sharma', 'Family Type : Nuclear']],
            ['CONTACT', ['City : Mumbai', 'Mobile : XXXXXXXXXX']]
          ].map(([sec, rows]) => (
            <div key={sec}>
              <div className="text-[5px] font-bold tracking-wider border-b mb-0.5 pb-0.5" style={{ color, borderColor: color }}>
                ✦ {sec} ✦
              </div>
              {rows.map(r => <div key={r} className="text-[5px] text-stone-600">{r}</div>)}
            </div>
          ))}
        </div>
        <div className="text-center text-white text-[5px] py-1" style={{ background: color }}>॥ शुभ विवाह ॥</div>
      </div>
    ),
  },
  {
    id: 2,
    name: 'Modern Minimal',
    desc: 'Clean lines with accent color sidebar',
    color: '#1e293b',
    preview: (name, color) => (
      <div className="w-full h-full flex overflow-hidden rounded-lg text-[6px]">
        <div className="w-5 flex-shrink-0" style={{ background: color }} />
        <div className="flex-1 bg-white p-1.5 space-y-1.5">
          <div>
            <div className="text-[10px] font-bold text-stone-800">{name || 'Full Name'}</div>
            <div className="text-[5px] text-stone-400 tracking-widest uppercase">Marriage Biodata</div>
            <div className="h-px mt-1" style={{ background: color }} />
          </div>
          {[['PERSONAL', ['Age · Gender · Religion', 'Height · Complexion']],
            ['EDUCATION', ['Qualification · Field', 'Organization · Income']],
            ['FAMILY', ['Father · Mother', 'Native Place · Gotra']],
          ].map(([sec, rows]) => (
            <div key={sec}>
              <div className="text-[5px] font-bold tracking-widest uppercase mb-0.5" style={{ color }}>{sec}</div>
              {rows.map(r => <div key={r} className="text-[5px] text-stone-500">{r}</div>)}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 3,
    name: 'Floral Elegant',
    desc: 'Soft rose tones with decorative borders',
    color: '#9f1239',
    preview: (name, color) => (
      <div className="w-full h-full flex flex-col overflow-hidden rounded-lg text-[6px]" style={{ background: '#fff5f7' }}>
        <div className="text-center py-2 px-1" style={{ borderBottom: `2px solid ${color}` }}>
          <div className="text-[8px]" style={{ color }}>❋ ❋ ❋</div>
          <div className="text-[10px] font-bold mt-0.5" style={{ color }}>{name || 'Full Name'}</div>
          <div className="text-[5px] text-stone-400 tracking-widest">MARRIAGE BIODATA</div>
        </div>
        <div className="flex-1 px-2 py-1 space-y-1">
          {[['Personal Details', ['Date of Birth • Age • Religion', 'Height • Complexion • Caste']],
            ['Family Details', ['Father • Mother • Siblings', 'Family Type • Native Place']],
            ['Contact', ['City • State • Mobile']],
          ].map(([sec, rows]) => (
            <div key={sec}>
              <div className="text-[5px] font-bold mb-0.5" style={{ color }}>◆ {sec.toUpperCase()}</div>
              {rows.map(r => <div key={r} className="text-[5px] text-stone-500">{r}</div>)}
            </div>
          ))}
        </div>
        <div className="text-center py-1 text-[6px]" style={{ color, borderTop: `1px solid ${color}` }}>❋ शुभ विवाह ❋</div>
      </div>
    ),
  },
];

function TemplateStep({ selectedTemplate, templateCustomization, onSelect, onColorChange, name }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-stone-500">Click a template to select it. Your data will be shown live.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TEMPLATES.map((t) => {
          const isSelected = selectedTemplate === t.id;
          const color = isSelected ? templateCustomization.primaryColor : t.color;
          return (
            <motion.div
              key={t.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(t.id, t.color)}
              className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-rose-600 shadow-lg shadow-rose-100'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Live mini preview */}
              <div className="h-48 bg-stone-50 p-2">
                {t.preview(name, color)}
              </div>

              {/* Label */}
              <div className={`px-3 py-2.5 flex items-center justify-between ${isSelected ? 'bg-rose-50' : 'bg-white'}`}>
                <div>
                  <div className={`text-sm font-bold ${isSelected ? 'text-rose-700' : 'text-stone-700'}`}>{t.name}</div>
                  <div className="text-xs text-stone-400 mt-0.5">{t.desc}</div>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs flex-shrink-0"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Color picker for selected template */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="bg-stone-50 rounded-2xl p-4 border border-stone-200"
          >
            <p className="text-sm font-semibold text-stone-700 mb-3">🎨 Customize Color</p>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={templateCustomization.primaryColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-12 h-12 rounded-xl border border-stone-200 cursor-pointer p-1 bg-white"
              />
              <div>
                <div className="text-sm font-medium text-stone-700">Primary Color</div>
                <div className="text-xs text-stone-400 mt-0.5">{templateCustomization.primaryColor}</div>
              </div>
              {/* Preset colors */}
              <div className="flex gap-2 ml-auto flex-wrap">
                {['#8B0000','#1e293b','#9f1239','#1d4ed8','#15803d','#7c3aed','#b45309'].map(c => (
                  <button
                    key={c}
                    onClick={() => onColorChange(c)}
                    title={c}
                    className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
                      templateCustomization.primaryColor === c ? 'border-stone-700 scale-110' : 'border-transparent'
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CreateBiodata() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState(emptyForm);
  const [toast, setToast]     = useState('');
  const [savedId, setSavedId] = useState(null);
  const [errors, setErrors]   = useState({});  // ← validation errors for current step

  const { data: existing } = useGetBiodataById(id);
  const { mutate: createBiodata, isPending: isCreating } = useCreateBiodata();
  const { mutate: updateBiodata, isPending: isUpdating } = useUpdateBiodata();
  const isSaving = isCreating || isUpdating;

  // Populate form when editing
  useEffect(() => {
    if (existing) {
      const d = { ...existing };
      if (d.personal?.dateOfBirth) d.personal.dateOfBirth = d.personal.dateOfBirth.split('T')[0];
     setTimeout(() => {
        setForm(d);
        setSavedId(d._id);
      }, 0);
    }
  }, [existing]);

  const update = (section, val) => {
    setForm((f) => ({ ...f, [section]: val }));
    // Clear errors for that section as user types
    setErrors({});
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Validate current step before proceeding ───────────────────────────────
  const tryValidate = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast('⚠️ Please fill required fields');
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSave = (markComplete = false) => {
    // Validate steps 0 and 1 before final save
    const step0Errs = validateStep(0, form);
    const step1Errs = validateStep(1, form);
    const allErrs = { ...step0Errs, ...step1Errs };

    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      // Navigate to the first step with errors
      const firstErrStep = Object.keys(step0Errs).length > 0 ? 0 : 1;
      setDirection(firstErrStep < step ? -1 : 1);
      setStep(firstErrStep);
      showToast('⚠️ Please fill required fields');
      return;
    }

    const payload = { ...form, isComplete: markComplete };
    if (savedId) {
      updateBiodata({ id: savedId, data: payload }, {
        onSuccess: () => {
          showToast(markComplete ? '🎉 Biodata saved!' : '✅ Draft saved');
          if (markComplete) navigate('/dashboard');
        },
        onError: () => showToast('❌ Save failed, please try again'),
      });
    } else {
      createBiodata(payload, {
        onSuccess: (res) => {
          setSavedId(res.data.data._id);
          showToast(markComplete ? '🎉 Biodata saved!' : '✅ Draft saved');
          if (markComplete) navigate('/dashboard');
        },
        onError: () => showToast('❌ Save failed, please try again'),
      });
    }
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.2 } }),
  };

  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (!tryValidate()) return;   // ← block if current step invalid
    setDirection(1);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const goPrev = () => {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <PersonalStep    data={form.personal}   onChange={(v) => update('personal', v)}   errors={errors} />;
      case 1: return <ContactStep     data={form.contact}    onChange={(v) => update('contact', v)}    errors={errors} />;
      case 2: return <FamilyStep      data={form.family}     onChange={(v) => update('family', v)} />;
      case 3: return <EducationStep   education={form.education} profession={form.profession}
                        onEdu={(v) => update('education', v)} onProf={(v) => update('profession', v)} errors={errors} />;
      case 4: return <HoroscopeStep   data={form.horoscope}  onChange={(v) => update('horoscope', v)} />;
      case 5: return <PreferencesStep data={form.preferences} onChange={(v) => update('preferences', v)} />;
      case 6: return (
        <TemplateStep
          selectedTemplate={form.selectedTemplate}
          templateCustomization={form.templateCustomization}
          name={form.personal?.fullName}
          onSelect={(id, defaultColor) => setForm((f) => ({
            ...f,
            selectedTemplate: id,
            templateCustomization: { ...f.templateCustomization, primaryColor: defaultColor },
          }))}
          onColorChange={(color) => setForm((f) => ({
            ...f,
            templateCustomization: { ...f.templateCustomization, primaryColor: color },
          }))}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-stone-800 text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer">
            ← Back
          </button>
          <h1 className="text-lg font-bold text-stone-800">
            {isEdit ? '✏️ Edit Biodata' : '💍 Create Biodata'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-semibold text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Saving…' : '💾 Save Draft'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(savedId ? `/preview/${savedId}` : '#')}
            className="px-4 py-2 text-sm font-semibold text-blue-700 border border-blue-200 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
          >
            👁️ Preview
          </motion.button>
        </div>
      </div>

      {/* Step Progress */}
      <div className="bg-white border-b border-stone-100 px-4 overflow-x-auto">
        <div className="flex min-w-max">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setErrors({}); setDirection(s.id > step ? 1 : -1); setStep(s.id); }}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold border-b-2 transition-all duration-150 whitespace-nowrap cursor-pointer ${
                step === s.id
                  ? 'border-rose-700 text-rose-700'
                  : step > s.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              <span>{step > s.id ? '✓' : s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            key={`title-${step}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-xl font-bold text-stone-800">
              {STEPS[step].icon} {STEPS[step].label} Details
            </h2>
            <p className="text-sm text-stone-400 mt-0.5">Step {step + 1} of {STEPS.length}</p>
            <div className="mt-3 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-rose-700 rounded-full"
                initial={false}
                animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-stone-100 px-4 py-4 flex items-center justify-between sticky bottom-0 shadow-sm">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={goPrev}
          disabled={step === 0}
          className="px-5 py-2.5 text-sm font-semibold text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          ← Previous
        </motion.button>

        <span className="text-xs text-stone-400 font-medium">{step + 1} / {STEPS.length}</span>

        {step < STEPS.length - 1 ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={goNext}
            className="px-5 py-2.5 text-sm font-semibold bg-rose-800 hover:bg-rose-900 text-white rounded-xl transition-colors shadow-sm shadow-rose-900/20 cursor-pointer"
          >
            Next →
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="px-5 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? 'Saving…' : '🎉 Finish & Save'}
          </motion.button>
        )}
      </div>
    </div>
  );
}