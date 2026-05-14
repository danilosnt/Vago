import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './presentation/layouts/AppLayout';
import { ProjectsPage } from './presentation/pages/ProjectsPage';
import { ProjectDetailsPage } from './presentation/pages/ProjectDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ProjectsPage />} />
          <Route path="project/:id" element={<ProjectDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
