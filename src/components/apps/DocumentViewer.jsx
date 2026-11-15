import React from 'react';
import { IconDownload, IconExternalLink } from '@tabler/icons-react';

// A small PDF reader window. The PDF is our own file, so it is shown in a plain
// (unsandboxed) iframe: browsers refuse to render PDFs inside sandboxed frames.
const DocumentViewer = ({ windowData }) => {
  const url = windowData?.appData?.url || '/resume.pdf';
  const fileName = windowData?.appData?.fileName || url.split('/').pop();

  const button = {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
    fontSize: 12, color: '#1a1a1a', textDecoration: 'none', cursor: 'pointer',
    background: 'linear-gradient(#fdfdfd, #e3e6ea)', border: '1px solid #8f9aa8', borderRadius: 3,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#525659', fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'linear-gradient(#f4f6f9, #dfe4ea)', borderBottom: '1px solid #9aa4b1' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#1e395b', marginRight: 'auto' }}>{fileName}</span>
        <a href={url} download={fileName} style={button}>
          <IconDownload size={14} /> Download
        </a>
        <a href={url} target="_blank" rel="noreferrer" style={button}>
          <IconExternalLink size={14} /> Open in new tab
        </a>
      </div>
      <iframe
        src={`${url}#view=FitH`}
        title={fileName}
        style={{ flex: 1, border: 'none', background: '#525659' }}
      />
      <noscript>
        <a href={url}>Open {fileName}</a>
      </noscript>
    </div>
  );
};

export default DocumentViewer;
