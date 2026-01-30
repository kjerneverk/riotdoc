import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import DocPage from './components/DocPage'
import './App.css'

const DOC_SECTIONS = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        file: 'getting-started.md',
        description: 'Quick start guide and installation',
        category: 'guide'
    },
    {
        id: 'user-guide',
        title: 'User Guide',
        file: 'user-guide.md',
        description: 'Complete usage guide',
        category: 'guide'
    },
    {
        id: 'templates',
        title: 'Templates',
        file: 'templates.md',
        description: 'Understanding the template system',
        category: 'guide'
    },
    {
        id: 'prompt-workflow',
        title: 'Prompt Workflow',
        file: 'prompt-workflow.md',
        description: 'Document creation workflow',
        category: 'guide'
    },
    {
        id: 'version-numbering',
        title: 'Version Numbering',
        file: 'version-numbering.md',
        description: 'Version management system',
        category: 'guide'
    },
    {
        id: 'narrative-capture',
        title: 'Narrative Capture',
        file: 'narrative-capture.md',
        description: 'Conversation history tracking',
        category: 'guide'
    },
    {
        id: 'mcp-server',
        title: 'MCP Server',
        file: 'mcp.md',
        description: 'Model Context Protocol integration',
        category: 'integration'
    },
    {
        id: 'architecture',
        title: 'Architecture',
        file: 'architecture.md',
        description: 'System design and components',
        category: 'developer'
    },
    {
        id: 'testing-guide',
        title: 'Testing Guide',
        file: 'testing-guide.md',
        description: 'Testing strategies and best practices',
        category: 'developer'
    }
];

function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route path="/" element={<Layout docSections={DOC_SECTIONS} />}>
                    <Route index element={<DocPage docSections={DOC_SECTIONS} />} />
                    <Route path=":slug" element={<DocPage docSections={DOC_SECTIONS} />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
