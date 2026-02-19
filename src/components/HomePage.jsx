import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import SelectionModal from './upload/SelectionModal';
import UploadZone from './upload/UploadZone';
import TextEntryView from './upload/TextEntryView';
import SearchResultsView from './search/SearchResultsView';
import PreviewView from './preview/PreviewView';
import QuizView from './quiz/QuizView';
import QuizHistoryView from './quiz/QuizHistoryView';
import QuizAttemptDetailView from './quiz/QuizAttemptDetailView';
import DashboardView from './dashboard/DashboardView';
import noteService from '../services/noteService';
import MetadataForm from './upload/MetadataForm';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: materialId } = useParams();
  const [searchParams] = useSearchParams();
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchCategory, setSearchCategory] = useState(searchParams.get('type') || 'all');
  const [selectedNoteType, setSelectedNoteType] = useState('pdf');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [realNotes, setRealNotes] = useState([]);
  const [manualText, setManualText] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [activeMaterial, setActiveMaterial] = useState(null);
  
  const [isMetadataFormOpen, setIsMetadataFormOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [collectionIds, setCollectionIds] = useState([]);
  const [collectionNotes, setCollectionNotes] = useState([]);
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  });

  const mapNoteToUI = (note) => ({
    id: note._id,
    name: note.title,
    type: note.type,
    date: new Date(note.createdAt).toLocaleDateString(),
    size: note.fileSize ? `${(note.fileSize / 1024 / 1024).toFixed(1)} MB` : 'Text',
    icon: note.type === 'pdf' ? '📕' : note.type === 'word' ? '📘' : note.type === 'handwritten' ? '🖼️' : '📝',
    uploadedBy: note.user?.name || 'You',
    content: note.content,
    fileUrl: note.fileUrl ? `https://oceanx-backend.onrender.com${note.fileUrl}` : null,
    chapterName: note.chapterName,
    subject: note.subject,
    uploaderId: note.user?._id || note.user?.id || note.user
  });

  const MOCK_MATERIALS = [
    { id: 1, name: 'Physics-101-Midterm-Prep.pdf', type: 'pdf', date: '2 hours ago', size: '2.4 MB', icon: '📕', uploadedBy: 'Sarah Johnson', subject: 'Physics', chapterName: 'Midterm Prep' },
    { id: 2, name: 'Calculus_II_Final_Integration.docx', type: 'word', date: 'Yesterday', size: '1.1 MB', icon: '📘', uploadedBy: 'Alex Chen', subject: 'Math', chapterName: 'Integration' },
    { id: 3, name: 'Biology_Cell_Structure_Quiz', type: 'quiz', date: '3 days ago', size: '15 Questions', icon: '📝', uploadedBy: 'Sarah Johnson', subject: 'Biology', chapterName: 'Cell Structure' },
    { id: 4, name: 'Linear_Algebra_Review_Handwritten.jpeg', type: 'handwritten', date: '1 week ago', size: '5.8 MB', icon: '🖼️', uploadedBy: 'Mike Ross', subject: 'Math', chapterName: 'Linear Algebra' },
    { id: 5, name: 'Marketing_Strategy_Case_Study.pdf', type: 'pdf', date: 'Oct 12', size: '4.2 MB', icon: '📕', uploadedBy: 'Sarah Johnson', subject: 'Marketing', chapterName: 'Strategy' },
    { id: 6, name: 'Organic_Chemistry_Summary.pdf', type: 'pdf', date: 'Oct 10', size: '1.8 MB', icon: '📕', uploadedBy: 'Emily Blunt', subject: 'Chemistry', chapterName: 'Organics' }
  ];

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const response = await noteService.fetchNotes(searchQuery, searchCategory);
        setRealNotes(response.data.map(mapNoteToUI));
      } catch (err) {
        console.error('Error loading notes:', err);
      }
    };
    loadNotes();
  }, [searchQuery, searchCategory]);
  
  useEffect(() => {
    const loadCollection = async () => {
      try {
        const response = await noteService.fetchCollectionNotes();
        if (response.success) {
          setCollectionIds(response.data.map(n => n._id));
          setCollectionNotes(response.data.map(mapNoteToUI));
        }
      } catch (err) {
        console.error('Error loading collection:', err);
      }
    };
    loadCollection();
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    if (q !== null) setSearchQuery(q);
    if (type !== null) setSearchCategory(type || 'all');
  }, [searchParams]);

  useEffect(() => {
    const loadActiveMaterial = async () => {
      const isNotePath = location.pathname.startsWith('/preview') || location.pathname.startsWith('/quiz/');
      
      if (!materialId || !isNotePath) {
        setActiveMaterial(null);
        return;
      }

      const mock = MOCK_MATERIALS.find(m => m.id === parseInt(materialId));
      if (mock) { setActiveMaterial(mock); return; }

      const foundInState = realNotes.find(n => n.id === materialId);
      if (foundInState) { setActiveMaterial(foundInState); return; }

      try {
        setIsLoading(true);
        const response = await noteService.fetchNoteById(materialId);
        if (response.success && response.data) {
          setActiveMaterial(mapNoteToUI(response.data));
        }
      } catch (err) {
        console.error('Error loading note details:', err);
        setFeedback({ message: 'Could not load material details', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    loadActiveMaterial();
  }, [materialId]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
      setIsModalOpen(false);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;
    setPendingFile(file);
    setIsMetadataFormOpen(true);
  };

  const handleMetadataSubmit = async (metadata) => {
    setIsMetadataFormOpen(false);
    if (!pendingFile) return;

    setIsLoading(true);
    setFeedback({ message: 'Uploading note...', type: 'info' });

    try {
      const formData = new FormData();
      formData.append('file', pendingFile);
      formData.append('title', metadata.title);
      formData.append('chapterName', metadata.chapterName);
      formData.append('subject', metadata.subject);
      formData.append('type', selectedNoteType);

      const response = await noteService.uploadNoteFile(formData);
      
      setFeedback({ message: 'Note uploaded successfully!', type: 'success' });
      setUploadedFiles(prev => [...prev, response.data]);
      
      const notesRes = await noteService.fetchNotes(searchQuery);
      setRealNotes(notesRes.data.map(mapNoteToUI));

      setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
    } catch (err) {
      setFeedback({ message: err.response?.data?.error || 'Upload failed', type: 'error' });
      setTimeout(() => setFeedback({ message: '', type: '' }), 5000);
    } finally {
      setIsLoading(false);
      setPendingFile(null);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualTitle.trim()) {
      setFeedback({ message: 'Please provide a title for your note', type: 'error' });
      setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
      return;
    }

    if (manualText.trim()) {
      setIsLoading(true);
      setFeedback({ message: 'Saving text note...', type: 'info' });

      try {
        const noteData = { title: manualTitle.trim(), content: manualText, type: 'text' };
        const response = await noteService.uploadNoteText(noteData);
        
        setFeedback({ message: 'Text note saved!', type: 'success' });
        setUploadedFiles(prev => [...prev, response.data]);
        setManualText('');
        setManualTitle('');
        setIsTextMode(false);
        navigate('/upload');
        
        setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
      } catch (err) {
        setFeedback({ message: err.response?.data?.error || 'Failed to save note', type: 'error' });
        setTimeout(() => setFeedback({ message: '', type: '' }), 5000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleCollection = async (noteId) => {
    try {
      const response = await noteService.toggleCollection(noteId);
      if (response.success) {
        setCollectionIds(response.data);
        const notesRes = await noteService.fetchCollectionNotes();
        setCollectionNotes(notesRes.data.map(mapNoteToUI));
        setFeedback({ 
          message: response.isCollected ? 'Added to collection' : 'Removed from collection', 
          type: 'success' 
        });
        setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
      }
    } catch (err) {
      console.error('Error toggling collection:', err);
      setFeedback({ message: 'Failed to update collection', type: 'error' });
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) return;

    try {
      await noteService.deleteNote(noteId);
      setRealNotes(prev => prev.filter(n => n.id !== noteId));
      setCollectionNotes(prev => prev.filter(n => n.id !== noteId));
      
      if (activeMaterial && activeMaterial.id === noteId) {
        setActiveMaterial(null);
        navigate('/search');
      }

      setFeedback({ message: 'Note deleted permanently', type: 'success' });
      setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error deleting note:', err);
      setFeedback({ message: 'Failed to delete note. Ensure you are the owner.', type: 'error' });
    }
  };

  const handleSearchTrigger = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchCategory}`);
    }
  };

  const selectNoteType = (type) => {
    setSelectedNoteType(type);
    if (type === 'text') {
      setIsTextMode(true);
      setIsModalOpen(false);
      navigate('/upload');
    } else {
      const input = document.getElementById('file-upload');
      if (type === 'pdf') input.setAttribute('accept', '.pdf');
      else if (type === 'word') input.setAttribute('accept', '.doc,.docx,.ppt,.pptx');
      else if (type === 'handwritten') input.setAttribute('accept', 'image/*');
      input.click();
    }
  };

  const path = location.pathname;

  const renderContent = () => {
    if (path.startsWith('/quiz/') && activeMaterial) {
      return <QuizView material={activeMaterial} onExit={() => navigate(`/preview/${materialId}`)} />;
    }
    if (path === '/quiz-history') {
      return <QuizHistoryView />;
    }
    if (path.startsWith('/quiz-history/')) {
      return <QuizAttemptDetailView />;
    }
    if (path.startsWith('/preview') && activeMaterial) {
      return (
        <PreviewView 
          material={activeMaterial} 
          isCollected={collectionIds.includes(activeMaterial.id)}
          onToggleCollection={() => handleToggleCollection(activeMaterial.id)}
          onBack={() => navigate('/search' + (searchQuery ? `?q=${searchQuery}` : ''))} 
          onStartLearning={() => navigate(`/quiz/${materialId}`)}
        />
      );
    }
    if (path === '/search') {
      return (
        <SearchResultsView 
          materials={realNotes}
          searchQuery={searchQuery}
          onSelectMaterial={(item) => navigate(`/preview/${item.id}`)}
          onClearSearch={() => { setSearchQuery(''); navigate('/upload'); }}
          onToggleCollection={handleToggleCollection}
          collectionIds={collectionIds}
          onDelete={handleDeleteNote}
          currentUserId={currentUser?.id}
        />
      );
    }
    if (path === '/collections') {
      return (
        <SearchResultsView 
          materials={collectionNotes}
          searchQuery=""
          onSelectMaterial={(item) => navigate(`/preview/${item.id}`)}
          onClearSearch={() => navigate('/upload')}
          isCollectionsView={true}
          onToggleCollection={handleToggleCollection}
          collectionIds={collectionIds}
          onDelete={handleDeleteNote}
          currentUserId={currentUser?.id}
        />
      );
    }
    if (path === '/dashboard') {
      return <DashboardView />;
    }
    if (isTextMode) {
      return (
        <TextEntryView 
          manualText={manualText}
          setManualText={setManualText}
          manualTitle={manualTitle}
          setManualTitle={setManualTitle}
          onSubmit={handleManualSubmit}
          onCancel={() => setIsTextMode(false)}
        />
      );
    }
    return (
      <UploadZone 
        dragActive={dragActive}
        onDrag={handleDrag}
        onDrop={handleDrop}
        onOpenModal={() => setIsModalOpen(true)}
      />
    );
  };

  // Determine if the current view needs full-height scrollable layout vs centered layout
  const isCenteredView = path === '/upload' && !isTextMode;

  return (
    <div className="flex h-screen w-full md:flex-row bg-mesh font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        onUploadClick={() => { setIsTextMode(false); setIsModalOpen(true); navigate('/upload'); }} 
      />

      {/* Main column */}
      <div className="flex flex-1 flex-col h-full overflow-hidden relative min-w-0">
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearchTrigger}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          viewMode={path === '/upload' ? 'HOME' : 'OTHER'}
          setViewMode={(mode) => mode === 'HOME' ? navigate('/upload') : null}
        />

        {/* Content area — fills remaining height, scrolls internally */}
        <main className="flex-1 min-h-0 px-3 py-3 md:px-5 md:py-4 flex flex-col pb-[72px] md:pb-4">
          {/* Card shell */}
          <div className={`relative flex-1 min-h-0 rounded-2xl bg-white/85 backdrop-blur-sm border border-white shadow-lg shadow-blue-100/20 overflow-hidden flex flex-col ${isCenteredView ? 'items-center justify-center' : ''}`}>

            {/* Animated ocean wave decoration - Fixed for full width & Vibrant Blue */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden h-24 opacity-[0.05] z-0" aria-hidden="true">
              <svg viewBox="0 0 2880 80" preserveAspectRatio="none" className="h-full animate-wave">
                <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,40 C1620,80 1800,0 1980,40 C2160,80 2340,0 2520,40 C2700,80 2880,20 2880,40 L2880,80 L0,80 Z" fill="#3b82f6"/>
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden h-16 opacity-[0.04] z-0" aria-hidden="true">
              <svg viewBox="0 0 2880 60" preserveAspectRatio="none" className="h-full animate-wave-slow">
                <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 C1680,60 1920,0 2160,30 C2400,60 2640,0 2880,30 L2880,60 L0,60 Z" fill="#0ea5e9"/>
              </svg>
            </div>

            {/* Corner glows */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -mr-36 -mt-36 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-100/20 rounded-full blur-3xl -ml-28 -mb-28 pointer-events-none" />

            {/* Scrollable inner content */}
            <div className={`relative z-10 flex-1 min-h-0 w-full flex flex-col ${isCenteredView ? 'items-center justify-center p-5 md:p-8' : 'p-3 md:p-6'}`}>
              {renderContent()}
            </div>

            {/* Toast notification */}
            {feedback.message && (
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl z-50 whitespace-nowrap animate-slide-up ${
                feedback.type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-200/50' : 
                feedback.type === 'error' ? 'bg-rose-500 text-white shadow-rose-200/50' : 
                'bg-blue-600 text-white shadow-blue-200/50'
              }`}>
                {feedback.message}
              </div>
            )}

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-sm z-40 flex flex-col items-center justify-center rounded-2xl">
                <div className="relative">
                  <div className="h-14 w-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-lg">🎓</div>
                </div>
                <p className="mt-4 font-bold text-blue-600 uppercase tracking-widest text-xs">Knowledge Loading...</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <SelectionModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSelectNoteType={selectNoteType}
      />

      {isMetadataFormOpen && (
        <MetadataForm 
          file={pendingFile}
          noteType={selectedNoteType}
          onClose={() => { setIsMetadataFormOpen(false); setPendingFile(null); }}
          onSubmit={handleMetadataSubmit}
        />
      )}

      <input type="file" id="file-upload" className="hidden" multiple onChange={handleChange} />
    </div>
  );
}

export default HomePage;
