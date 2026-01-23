import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../seo/SEO';
import { sampleJobs } from '../components/Jobs/jobData';

function findJobInSample(id) {
  const numeric = Number(id);
  for (const k of Object.keys(sampleJobs)) {
    const arr = sampleJobs[k];
    for (const j of arr) {
      if (j && j.id === numeric) return j;
    }
  }
  return null;
}

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        if (mounted) setJob(data.job || data);
      } catch (e) {
        const fallback = findJobInSample(id);
        if (mounted) {
          if (fallback) setJob(fallback);
          else setError('Job not found');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchJob();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div style={{padding:20}}>Loading...</div>;
  if (error) return (<div style={{padding:20}}><h2>{error}</h2><p><Link to='/jobs'>Back to jobs</Link></p></div>);
  if (!job) return (<div style={{padding:20}}><h2>Job not found</h2><p><Link to='/jobs'>Back to jobs</Link></p></div>);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.shortDescription || job.overview || job.description || '',
    'datePosted': job.datePosted || new Date().toISOString().split('T')[0],
    'validThrough': job.closingDate || '',
    'employmentType': job.jobType || 'FULL_TIME',
    'hiringOrganization': { '@type':'Organization','name': job.company || 'MytechZ', 'sameAs': 'https://mytechz.in' },
    'jobLocation': { '@type': 'Place', 'address': { '@type':'PostalAddress', 'addressLocality': job.location || '' , 'addressCountry': 'IN' } }
  };

  return (
    <div style={{padding:20,maxWidth:900,margin:'0 auto'}}>
      <SEO title={job.title + ' — ' + (job.company||'MytechZ')} description={job.shortDescription} url={typeof window !== 'undefined' ? window.location.href : ''} schemaData={schemaData} />
      <h1>{job.title}</h1>
      <h3>{job.company} — {job.location}</h3>
      <p><strong>Salary:</strong> {job.salary || 'Not specified'} | <strong>Type:</strong> {job.jobType}</p>
      <hr />
      <div>
        <h4>Overview</h4>
        <p>{job.overview || job.shortDescription}</p>
        <h4>Qualifications & Requirements</h4>
        {job.requirements ? (<ul>{job.requirements.map((r,i)=>(<li key={i}>{r}</li>))}</ul>) : null}
      </div>
      <p><Link to='/jobs'>Back to jobs</Link></p>
    </div>
  );
}
