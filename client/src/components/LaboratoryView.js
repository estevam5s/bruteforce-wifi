import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeEditor from './CodeEditor';
import '../styles/LaboratoryView.css';

const LaboratoryView = ({ laboratory, containerId, userId, onClose }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // content, exercises, challenges
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [exerciseOutput, setExerciseOutput] = useState('');
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    loadProgress();
    // Selecionar primeiro módulo e lição automaticamente
    if (laboratory.modules && laboratory.modules.length > 0) {
      setSelectedModule(laboratory.modules[0]);
      if (laboratory.modules[0].lessons && laboratory.modules[0].lessons.length > 0) {
        setSelectedLesson(laboratory.modules[0].lessons[0]);
      }
    }
  }, [laboratory]);

  const loadProgress = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cyberlab/progress/${userId}/${laboratory.id}`);
      const data = await response.json();
      if (data.success) {
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    if (module.lessons && module.lessons.length > 0) {
      setSelectedLesson(module.lessons[0]);
    }
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('content');
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setUserCode(exercise.initialCode || '');
    setExerciseOutput('');
    setActiveTab('exercises');
  };

  const handleRunCode = async () => {
    if (!containerId) {
      alert('Você precisa ter um container ativo para executar código!');
      return;
    }

    setExecuting(true);
    setExerciseOutput('Executando...');

    try {
      const response = await fetch(`http://localhost:5000/api/cyberlab/execute/${containerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: userCode,
          language: laboratory.id.includes('python') ? 'python' : 'bash'
        })
      });

      const data = await response.json();

      if (data.success) {
        setExerciseOutput(data.output);

        // Verificar se o exercício foi concluído com sucesso
        if (selectedExercise.validation) {
          const isValid = validateExercise(data.output, selectedExercise.validation);
          if (isValid) {
            await markExerciseCompleted();
          }
        }
      } else {
        setExerciseOutput(`Erro: ${data.error}`);
      }
    } catch (error) {
      setExerciseOutput(`Erro: ${error.message}`);
    } finally {
      setExecuting(false);
    }
  };

  const validateExercise = (output, validation) => {
    if (validation.type === 'output_contains') {
      return validation.expected.every(exp => output.includes(exp));
    } else if (validation.type === 'function_exists') {
      return output.includes(validation.function_name);
    }
    return false;
  };

  const markExerciseCompleted = async () => {
    try {
      await fetch(`http://localhost:5000/api/cyberlab/progress/${userId}/${laboratory.id}/exercise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: selectedModule.id,
          lessonId: selectedLesson.id,
          exerciseId: selectedExercise.id,
          solution: userCode
        })
      });
      loadProgress();
      alert('Exercício concluído! +25 pontos');
    } catch (error) {
      console.error('Error marking exercise:', error);
    }
  };

  const markLessonCompleted = async () => {
    try {
      await fetch(`http://localhost:5000/api/cyberlab/progress/${userId}/${laboratory.id}/lesson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: selectedModule.id,
          lessonId: selectedLesson.id
        })
      });
      loadProgress();
      alert('Lição concluída! +10 pontos');
    } catch (error) {
      console.error('Error marking lesson:', error);
    }
  };

  const isLessonCompleted = (moduleId, lessonId) => {
    if (!progress) return false;
    return progress.completedLessons.includes(`${moduleId}_${lessonId}`);
  };

  const isExerciseCompleted = (moduleId, lessonId, exerciseId) => {
    if (!progress) return false;
    return progress.completedExercises.includes(`${moduleId}_${lessonId}_${exerciseId}`);
  };

  return (
    <div className="laboratory-view">
      <div className="lab-header-bar">
        <div className="lab-title-section">
          <span className="lab-icon">{laboratory.icon}</span>
          <div>
            <h2>{laboratory.name}</h2>
            <div className="lab-meta">
              <span className="badge difficulty">{laboratory.difficulty}</span>
              <span className="badge duration">⏱️ {laboratory.duration}</span>
              {progress && (
                <span className="badge points">⭐ {progress.totalPoints} pontos</span>
              )}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      <div className="lab-content-wrapper">
        {/* Sidebar com Módulos e Lições */}
        <div className="lab-sidebar">
          <div className="sidebar-header">
            <h3>📚 Módulos</h3>
          </div>
          <div className="modules-list">
            {laboratory.modules && laboratory.modules.map(module => (
              <div key={module.id} className="module-item">
                <div
                  className={`module-header ${selectedModule?.id === module.id ? 'active' : ''}`}
                  onClick={() => handleModuleSelect(module)}
                >
                  <span className="module-number">{module.id}</span>
                  <span className="module-title">{module.title}</span>
                </div>
                {selectedModule?.id === module.id && (
                  <div className="lessons-list">
                    {module.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className={`lesson-item ${selectedLesson?.id === lesson.id ? 'active' : ''} ${isLessonCompleted(module.id, lesson.id) ? 'completed' : ''}`}
                        onClick={() => handleLessonSelect(lesson)}
                      >
                        {isLessonCompleted(module.id, lesson.id) && <span className="check">✓</span>}
                        {lesson.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {laboratory.challenges && laboratory.challenges.length > 0 && (
            <div className="challenges-section">
              <div className="sidebar-header">
                <h3>🏆 Desafios</h3>
              </div>
              {laboratory.challenges.map(challenge => (
                <div key={challenge.id} className="challenge-item">
                  <div className="challenge-title">{challenge.title}</div>
                  <div className="challenge-points">{challenge.points} pts</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Área de Conteúdo Principal */}
        <div className="lab-main-content">
          {selectedLesson && (
            <>
              <div className="content-tabs">
                <button
                  className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                  onClick={() => setActiveTab('content')}
                >
                  📖 Conteúdo
                </button>
                <button
                  className={`tab-btn ${activeTab === 'exercises' ? 'active' : ''}`}
                  onClick={() => setActiveTab('exercises')}
                  disabled={!selectedLesson.exercises || selectedLesson.exercises.length === 0}
                >
                  💻 Exercícios ({selectedLesson.exercises?.length || 0})
                </button>
              </div>

              <div className="content-area">
                {activeTab === 'content' && (
                  <div className="lesson-content">
                    <h2>{selectedLesson.title}</h2>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedLesson.content}
                    </ReactMarkdown>

                    {!isLessonCompleted(selectedModule.id, selectedLesson.id) && (
                      <button
                        className="btn-complete-lesson"
                        onClick={markLessonCompleted}
                      >
                        ✓ Marcar como Concluído
                      </button>
                    )}

                    {selectedLesson.exercises && selectedLesson.exercises.length > 0 && (
                      <div className="lesson-exercises-list">
                        <h3>Exercícios Práticos:</h3>
                        {selectedLesson.exercises.map(exercise => (
                          <div
                            key={exercise.id}
                            className={`exercise-preview ${isExerciseCompleted(selectedModule.id, selectedLesson.id, exercise.id) ? 'completed' : ''}`}
                            onClick={() => handleExerciseSelect(exercise)}
                          >
                            {isExerciseCompleted(selectedModule.id, selectedLesson.id, exercise.id) && (
                              <span className="check">✓</span>
                            )}
                            <div>
                              <div className="exercise-title">{exercise.title}</div>
                              <div className="exercise-description">{exercise.description}</div>
                            </div>
                            <button className="btn-small">Resolver →</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'exercises' && selectedExercise && (
                  <div className="exercise-workspace">
                    <div className="exercise-header">
                      <h2>{selectedExercise.title}</h2>
                      {isExerciseCompleted(selectedModule.id, selectedLesson.id, selectedExercise.id) && (
                        <span className="badge completed">✓ Concluído</span>
                      )}
                    </div>
                    <p className="exercise-description">{selectedExercise.description}</p>

                    <div className="code-execution-area">
                      <div className="code-editor-section">
                        <div className="section-header">
                          <h4>💻 Editor de Código</h4>
                          <button
                            className="btn-run"
                            onClick={handleRunCode}
                            disabled={executing || !containerId}
                          >
                            {executing ? '⏳ Executando...' : '▶️ Executar'}
                          </button>
                        </div>
                        <CodeEditor
                          value={userCode}
                          onChange={setUserCode}
                          language={laboratory.id.includes('python') ? 'python' : 'bash'}
                        />
                      </div>

                      <div className="output-section">
                        <div className="section-header">
                          <h4>📤 Saída</h4>
                        </div>
                        <pre className="code-output">{exerciseOutput || 'Aguardando execução...'}</pre>
                      </div>
                    </div>

                    {selectedExercise.solution && (
                      <details className="solution-details">
                        <summary>💡 Ver Solução</summary>
                        <CodeEditor
                          value={selectedExercise.solution}
                          language={laboratory.id.includes('python') ? 'python' : 'bash'}
                          readOnly
                        />
                      </details>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaboratoryView;
