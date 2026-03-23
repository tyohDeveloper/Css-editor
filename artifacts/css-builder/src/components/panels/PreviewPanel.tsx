import React, { useEffect, useState, useRef } from 'react';
import { useCssStore } from '@/store/use-css-store';
import { generateCssString } from '@/lib/css-parser';
import { MonitorPlay, Smartphone, Tablet } from 'lucide-react';
import { motion } from 'framer-motion';

const SAMPLE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style id="injected-css">
    /* Injected CSS will go here */
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Document Heading (h1)</h1>
      <p>A subtitle paragraph describing the document. <em>Emphasis</em> and <strong>Strong</strong> tags included.</p>
    </header>

    <main>
      <section>
        <h2>Typography & Spacing (h2)</h2>
        <p>This is a standard paragraph. CSS builders help visualize changes instantly. They are invaluable for rapid prototyping and ensuring consistent design systems across a project.</p>
        <p>Another paragraph to show margin and spacing. <a href="#">This is a text link</a> that might have hover states defined.</p>
      </section>

      <section>
        <h3>Lists & Enumeration (h3)</h3>
        <ul>
          <li>Unordered list item one</li>
          <li>Unordered list item two with a <a href="#">link inside</a></li>
          <li>Unordered list item three</li>
        </ul>
        <ol>
          <li>First step in the ordered list</li>
          <li>Second step</li>
          <li>Third step</li>
        </ol>
      </section>

      <section>
        <h4>Data Presentation (h4)</h4>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>101</td>
              <td>Alice Smith</td>
              <td>Engineer</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>102</td>
              <td>Bob Jones</td>
              <td>Designer</td>
              <td>Pending</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h4>Form Elements</h4>
        <form onsubmit="event.preventDefault();">
          <fieldset>
            <legend>Contact Form</legend>
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" />
            </div>
            <div class="form-group">
              <label for="role">Role</label>
              <select id="role">
                <option>Developer</option>
                <option>Designer</option>
                <option>Manager</option>
              </select>
            </div>
            <div class="form-group">
              <label for="msg">Message</label>
              <textarea id="msg" rows="3" placeholder="Enter text here..."></textarea>
            </div>
            <button type="submit">Submit Form</button>
          </fieldset>
        </form>
      </section>
    </main>
  </div>
</body>
</html>
`;

export function PreviewPanel() {
  const { rules } = useCssStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Inject CSS directly into iframe without reloading the whole srcDoc to maintain scroll pos
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentDocument) {
      const doc = iframeRef.current.contentDocument;
      let styleTag = doc.getElementById('injected-css');
      
      // If it's the first load, write the full HTML
      if (!styleTag) {
        doc.open();
        doc.write(SAMPLE_HTML);
        doc.close();
        styleTag = doc.getElementById('injected-css');
      }

      if (styleTag) {
        styleTag.textContent = generateCssString(rules);
      }
    }
  }, [rules]);

  const getDeviceWidth = () => {
    switch(device) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0D0D12] overflow-hidden">
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          Live Preview
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </h2>
        
        <div className="flex p-1 bg-secondary/50 rounded-lg">
          <button 
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-md transition-colors ${device === 'desktop' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Desktop View"
          >
            <MonitorPlay size={16} />
          </button>
          <button 
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-md transition-colors ${device === 'tablet' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Tablet View"
          >
            <Tablet size={16} />
          </button>
          <button 
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-md transition-colors ${device === 'mobile' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Mobile View"
          >
            <Smartphone size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] flex items-center justify-center p-4 overflow-y-auto">
        <motion.div 
          animate={{ width: getDeviceWidth() }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          className={`h-full bg-white rounded-lg shadow-2xl overflow-hidden ring-1 ring-white/10 ${device !== 'desktop' ? 'my-auto max-h-[812px]' : ''}`}
        >
          <iframe 
            ref={iframeRef}
            className="w-full h-full border-none bg-white"
            title="Live Preview"
            sandbox="allow-same-origin allow-scripts"
          />
        </motion.div>
      </div>
    </div>
  );
}
