
'use client';

import { useState, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, PlusCircle, Trash2, Mail, Phone, MapPin, Link as LinkIcon, Edit, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format, parseISO } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

type ResumeFormData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];
  skills: {
    skill: string;
  }[];
  labels: {
    summary: string;
    experience: string;
    education: string;
    skills: string;
  };
  dateFormat: string;
};

const dateFormats = [
    { value: 'MMM yyyy', label: 'Month YYYY (e.g., Oct 2023)' },
    { value: 'MM/yyyy', label: 'MM/YYYY (e.g., 10/2023)' },
    { value: 'yyyy', label: 'YYYY (e.g., 2023)' },
];

export function ResumeBuilderForm() {
  const [photo, setPhoto] = useState<string | null>(null);

  const { register, control, handleSubmit, watch } = useForm<ResumeFormData>({
    defaultValues: {
      name: 'Your Name',
      title: 'Professional Title',
      email: 'your.email@example.com',
      phone: '(123) 456-7890',
      address: 'City, State',
      website: 'yourportfolio.com',
      summary: 'A brief professional summary about yourself, highlighting your key skills and career goals.',
      experience: [{ company: 'Company Name', role: 'Your Role', startDate: '2020-01', endDate: 'Present', description: '- Your key achievement or responsibility' }],
      education: [{ school: 'University Name', degree: 'Your Degree', startDate: '2016-09', endDate: '2020-05' }],
      skills: [{ skill: 'A key skill' }, { skill: 'Another skill' }],
      labels: {
        summary: 'PROFESSIONAL SUMMARY',
        experience: 'WORK EXPERIENCE',
        education: 'EDUCATION',
        skills: 'SKILLS',
      },
      dateFormat: 'MMM yyyy',
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experience' });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control, name: 'skills' });
  
  const formData = watch();
  const { toast } = useToast();
  const resumeRef = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    if (!resumeRef.current) return;
    try {
        const canvas = await html2canvas(resumeRef.current, { 
            scale: 2, 
            windowWidth: resumeRef.current.scrollWidth,
            windowHeight: resumeRef.current.scrollHeight
        });
        const imgData = canvas.toDataURL('image/png');
        
        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = 297; // A4 height in mm
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const ratio = canvasWidth / canvasHeight;
        let contentWidth = pdfWidth;
        let contentHeight = contentWidth / ratio;
        
        if (contentHeight > pdfHeight) {
            contentHeight = pdfHeight;
            contentWidth = contentHeight * ratio;
        }

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageHeightMM = pdf.internal.pageSize.getHeight();
        const canvasHeightMM = (canvas.height * pdfWidth) / canvas.width;
        let position = 0;
        let remainingHeight = canvasHeightMM;
        
        let page = 1;
        while (remainingHeight > 0) {
            if (page > 1) {
              pdf.addPage();
            }
            pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, canvasHeightMM);
            remainingHeight -= pageHeightMM;
            position += pageHeightMM;
            page++;
        }
        
        pdf.save('resume.pdf');
        toast({ title: 'PDF Exported', description: 'Your resume has been downloaded.' });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Export Failed' });
    }
  };
  
  const formatResumeDate = (dateString: string) => {
    if (!dateString || dateString.toLowerCase() === 'present') {
      return 'Present';
    }
    try {
      // Append a day to make parseISO happy
      return format(parseISO(`${dateString}-02`), formData.dateFormat);
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
  };
  
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhoto(reader.result as string);
        }
        reader.readAsDataURL(file);
    }
  };


  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6 overflow-y-auto max-h-[80vh] p-2 no-scrollbar">
        <Card>
          <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="photo-upload">Photo</Label>
                <div className="flex items-center gap-2">
                    <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="flex-grow"/>
                    {photo && <Button variant="ghost" size="icon" onClick={() => setPhoto(null)}><Trash2 className="h-4 w-4"/></Button>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Full Name</Label><Input {...register('name')} /></div>
              <div className="space-y-1"><Label>Title</Label><Input {...register('title')} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1"><Label>Email</Label><Input type="email" {...register('email')} /></div>
               <div className="space-y-1"><Label>Phone</Label><Input type="tel" {...register('phone')} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1"><Label>Address</Label><Input {...register('address')} /></div>
               <div className="space-y-1"><Label>Website/Portfolio</Label><Input {...register('website')} /></div>
            </div>
             <div className="space-y-1"><Label>Summary</Label><Textarea {...register('summary')} rows={4}/></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Experience</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {expFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label>Company</Label><Input {...register(`experience.${index}.company`)} /></div>
                    <div className="space-y-1"><Label>Role</Label><Input {...register(`experience.${index}.role`)} /></div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label>Start Date</Label><Input type="month" {...register(`experience.${index}.startDate`)} /></div>
                    <div className="space-y-1"><Label>End Date</Label><Input type="text" placeholder="Present or YYYY-MM" {...register(`experience.${index}.endDate`)} /></div>
                </div>
                <div className="space-y-1"><Label>Description</Label><Textarea {...register(`experience.${index}.description`)} rows={3}/></div>
                <Button variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeExp(index)}><Trash2 className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => appendExp({ company: '', role: '', startDate: '', endDate: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Experience</Button>
          </CardContent>
        </Card>

         <Card>
          <CardHeader><CardTitle>Education</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {eduFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-md space-y-2 relative">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label>School</Label><Input {...register(`education.${index}.school`)} /></div>
                    <div className="space-y-1"><Label>Degree</Label><Input {...register(`education.${index}.degree`)} /></div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label>Start Date</Label><Input type="month" {...register(`education.${index}.startDate`)} /></div>
                    <div className="space-y-1"><Label>End Date</Label><Input type="month" {...register(`education.${index}.endDate`)} /></div>
                </div>
                 <Button variant="ghost" size="icon" className="absolute top-1 right-1" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => appendEdu({ school: '', degree: '', startDate: '', endDate: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Education</Button>
          </CardContent>
        </Card>
        
         <Card>
          <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {skillFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                    <Input {...register(`skills.${index}.skill`)} placeholder="e.g., JavaScript" />
                    <Button variant="ghost" size="icon" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4"/></Button>
                </div>
            ))}
            <Button variant="outline" onClick={() => appendSkill({ skill: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Add Skill</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Settings & Labels</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Date Format</Label>
                <Controller
                  control={control}
                  name="dateFormat"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {dateFormats.map(df => (
                          <SelectItem key={df.value} value={df.value}>{df.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <Label>Summary Label</Label>
                <Input {...register('labels.summary')} />
              </div>
              <div className="space-y-1">
                <Label>Experience Label</Label>
                <Input {...register('labels.experience')} />
              </div>
              <div className="space-y-1">
                <Label>Education Label</Label>
                <Input {...register('labels.education')} />
              </div>
              <div className="space-y-1">
                <Label>Skills Label</Label>
                <Input {...register('labels.skills')} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 sticky top-4 self-start">
        <Button onClick={exportPDF} size="lg" className="w-full">
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
        <Card className="shadow-lg">
          <CardContent
            ref={resumeRef}
            className="p-8 bg-white text-black aspect-[1/1.414] min-h-[1123px] w-[794px] overflow-auto scale-[0.7] sm:scale-[0.8] md:scale-[1] origin-top-left"
            style={{ fontFamily: 'sans-serif' }}
          >
            <header className="flex justify-between items-start mb-8">
              <div className="flex-1">
                <h1 className="text-4xl font-bold tracking-tight">{formData.name}</h1>
                <p className="text-lg text-gray-600">{formData.title}</p>
                <div className="flex flex-col gap-1 text-xs mt-4 text-gray-500">
                  {formData.email && <span className="flex items-center gap-2"><Mail className="w-3 h-3"/>{formData.email}</span>}
                  {formData.phone && <span className="flex items-center gap-2"><Phone className="w-3 h-3"/>{formData.phone}</span>}
                  {formData.address && <span className="flex items-center gap-2"><MapPin className="w-3 h-3"/>{formData.address}</span>}
                  {formData.website && <span className="flex items-center gap-2"><LinkIcon className="w-3 h-3"/>{formData.website}</span>}
                </div>
              </div>
              {photo ? (
                  <div className="w-32 h-32 relative">
                    <Image src={photo} alt="Resume Photo" layout="fill" objectFit="cover" className="rounded-full"/>
                  </div>
              ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                  </div>
              )}
            </header>

            {formData.summary && (
              <section>
                <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-2">{formData.labels.summary}</h2>
                <p className="text-sm">{formData.summary}</p>
              </section>
            )}
            
            {formData.experience?.length > 0 && (
              <section className="mt-6">
                <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-2">{formData.labels.experience}</h2>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-md font-semibold">{exp.role}</h3>
                      <p className="text-xs text-gray-600">{formatResumeDate(exp.startDate)} - {formatResumeDate(exp.endDate)}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{exp.company}</p>
                    <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                      {exp.description.split('\\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^-/, '').trim()}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
            )}
            
             {formData.education?.length > 0 && (
                <section className="mt-6">
                <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-2">{formData.labels.education}</h2>
                {formData.education.map((edu, index) => (
                    <div key={index} className="mb-2">
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-md font-semibold">{edu.school}</h3>
                        <p className="text-xs text-gray-600">{formatResumeDate(edu.startDate)} - {formatResumeDate(edu.endDate)}</p>
                    </div>
                    <p className="text-sm text-gray-700">{edu.degree}</p>
                    </div>
                ))}
                </section>
             )}

             {formData.skills?.length > 0 && formData.skills.some(s => s.skill) && (
                <section className="mt-6">
                <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-2">{formData.labels.skills}</h2>
                <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => skill.skill && (
                        <span key={index} className="inline-block bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2">{skill.skill}</span>
                    ))}
                </div>
                </section>
             )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
