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

  // Mapper to convert DB notes to UI format
  const mapNoteToUI = (note) => ({
    id: note._id,
    name: note.title,
    type: note.type,
    date: new Date(note.createdAt).toLocaleDateString(),
    size: note.fileSize ? `${(note.fileSize / 1024 / 1024).toFixed(1)} MB` : 'Text',
    icon: note.type === 'pdf' ? '📕' : note.type === 'word' ? '📘' : note.type === 'handwritten' ? '🖼️' : '📝',
    uploadedBy: note.user?.name || 'You',
    content: note.content,
    fileUrl: note.fileUrl ? `http://localhost:5000${note.fileUrl}` : null,
    chapterName: note.chapterName,
    subject: note.subject
  });

  const MOCK_MATERIALS = [
    { id: 1, name: 'Physics-101-Midterm-Prep.pdf', type: 'pdf', date: '2 hours ago', size: '2.4 MB', icon: '📕', uploadedBy: 'Sarah Johnson', subject: 'Physics', chapterName: 'Midterm Prep' },
    { id: 2, name: 'Calculus_II_Final_Integration.docx', type: 'word', date: 'Yesterday', size: '1.1 MB', icon: '📘', uploadedBy: 'Alex Chen', subject: 'Math', chapterName: 'Integration' },
    { id: 3, name: 'Biology_Cell_Structure_Quiz', type: 'quiz', date: '3 days ago', size: '15 Questions', icon: '📝', uploadedBy: 'Sarah Johnson', subject: 'Biology', chapterName: 'Cell Structure' },
    { id: 4, name: 'Linear_Algebra_Review_Handwritten.jpeg', type: 'handwritten', date: '1 week ago', size: '5.8 MB', icon: '🖼️', uploadedBy: 'Mike Ross', subject: 'Math', chapterName: 'Linear Algebra' },
    { id: 5, name: 'Marketing_Strategy_Case_Study.pdf', type: 'pdf', date: 'Oct 12', size: '4.2 MB', icon: '📕', uploadedBy: 'Sarah Johnson', subject: 'Marketing', chapterName: 'Strategy' },
    { id: 6, name: 'Organic_Chemistry_Summary.pdf', type: 'pdf', date: 'Oct 10', size: '1.8 MB', icon: '📕', uploadedBy: 'Emily Blunt', subject: 'Chemistry', chapterName: 'Organics' }
  ];

  // Fetch real notes on mount and when query/category changes
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
  
  // Fetch collection
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

  // Sync searchQuery and category with URL params if they exist
  useEffect(() => {
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    if (q !== null) setSearchQuery(q);
    if (type !== null) setSearchCategory(type || 'all');
  }, [searchParams]);

  // Load active material for preview/quiz
  useEffect(() => {
    const loadActiveMaterial = async () => {
      const isNotePath = location.pathname.startsWith('/preview') || location.pathname.startsWith('/quiz/');
      
      if (!materialId || !isNotePath) {
        setActiveMaterial(null);
        return;
      }

      // 1. Try mock data
      const mock = MOCK_MATERIALS.find(m => m.id === parseInt(materialId));
      if (mock) {
        setActiveMaterial(mock);
        return;
      }

      // 2. Try already loaded real notes
      const foundInState = realNotes.find(n => n.id === materialId);
      if (foundInState) {
        setActiveMaterial(foundInState);
        return;
      }

      // 3. Fetch from API if not found (e.g., direct link or refresh)
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
      
      // Refresh notes list
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
        const noteData = {
          title: manualTitle.trim(),
          content: manualText,
          type: 'text'
        };

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
        // Refresh collection notes list
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

  // Determine which component to render based on path
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

  return (
    <div className="flex h-screen w-full flex-col-reverse md:flex-row bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        onUploadClick={() => { setIsTextMode(false); setIsModalOpen(true); navigate('/upload'); }} 
        isTextMode={isTextMode}
      />

      <div className="flex flex-1 flex-col h-full overflow-hidden relative">
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearchTrigger}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          viewMode={path === '/upload' ? 'HOME' : 'OTHER'}
          setViewMode={(mode) => mode === 'HOME' ? navigate('/upload') : null}
        />

        <main className="flex-1 px-4 py-4 md:px-12 md:py-6 max-w-7xl mx-auto w-full flex flex-col overflow-hidden">
          <div className="relative overflow-hidden rounded-3xl md:rounded-[3rem] bg-white p-6 md:p-10 shadow-xl md:shadow-2xl shadow-slate-200/60 flex-1 flex flex-col items-center justify-center border border-slate-50">
            <div className="absolute -left-10 -top-10 md:-left-16 md:-top-16 text-[6rem] md:text-[10rem] font-black opacity-[0.02] rotate-12 pointer-events-none font-display">OceanX</div>
            <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-blue-100/30 rounded-full blur-[60px] md:blur-[120px] -mr-24 -mt-24 md:-mr-48 md:-mt-48 pointer-events-none"></div>

            {renderContent()}

            {feedback.message && (
              <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl font-bold shadow-xl animate-in slide-in-from-top duration-300 z-50 ${
                feedback.type === 'success' ? 'bg-emerald-500 text-white' : 
                feedback.type === 'error' ? 'bg-rose-500 text-white' : 
                'bg-blue-600 text-white'
              }`}>
                {feedback.message}
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-40 flex flex-col items-center justify-center rounded-[3rem]">
                <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-black text-blue-600 uppercase tracking-widest text-sm">Processing Material...</p>
              </div>
            )}
            
            <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 flex gap-3 md:gap-6 opacity-30 pointer-events-none">
              <div className="h-3 w-3 md:h-5 md:w-5 rounded-full bg-blue-500 animate-bounce"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 rounded-full bg-indigo-500 animate-bounce delay-150"></div>
              <div className="h-3 w-3 md:h-5 md:w-5 rounded-full bg-slate-500 animate-bounce delay-300"></div>
            </div>
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

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}} />
    </div>
  );
}

export default HomePage;
