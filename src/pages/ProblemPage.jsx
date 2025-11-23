// import { useState, useEffect, useRef } from 'react';

// import { useForm } from 'react-hook-form';
// import Editor from '@monaco-editor/react';
// import { useParams } from 'react-router';
// import axiosClient from "../utils/axiosClient"
// import SubmissionHistory from "../components/SubmissionHistory"
// import ChatAi from '../components/ChatAi';
// import Editorial from '../components/Editorial';

// const langMap = {
//         cpp: 'C++',
//         java: 'Java',
//         javascript: 'JavaScript'
// };

// const ProblemPage = () => {
//   const [problem, setProblem] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('javascript');
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [runResult, setRunResult] = useState(null);
//   const [submitResult, setSubmitResult] = useState(null);
//   const [activeLeftTab, setActiveLeftTab] = useState('description');
//   const [activeRightTab, setActiveRightTab] = useState('code');
//   const editorRef = useRef(null);
//   let {problemId}  = useParams();

//   const { handleSubmit } = useForm();

//  useEffect(() => {
//     const fetchProblem = async () => {
//       setLoading(true);
//       try {

//         const response = await axiosClient.get(`/problem/problemById/${problemId}`);

//         const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;

//         setProblem(response.data);

//         setCode(initialCode);
//         setLoading(false);

//       } catch (error) {
//         console.error('Error fetching problem:', error);
//         setLoading(false);
//       }
//     };

//     fetchProblem();
//   }, [problemId]);

//   // Update code when language changes
//   useEffect(() => {
//     if (problem) {
//       const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
//       setCode(initialCode);
//     }
//   }, [selectedLanguage, problem]);

//   const handleEditorChange = (value) => {
//     setCode(value || '');
//   };

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor;
//   };

//   const handleLanguageChange = (language) => {
//     setSelectedLanguage(language);
//   };

//   const handleRun = async () => {
//     setLoading(true);
//     setRunResult(null);

//     try {
//       const response = await axiosClient.post(`/submission/run/${problemId}`, {
//         code,
//         language: selectedLanguage
//       });

//       setRunResult(response.data);
//       setLoading(false);
//       setActiveRightTab('testcase');

//     } catch (error) {
//       console.error('Error running code:', error);
//       setRunResult({
//         success: false,
//         error: 'Internal server error'
//       });
//       setLoading(false);
//       setActiveRightTab('testcase');
//     }
//   };

//   const handleSubmitCode = async () => {
//     setLoading(true);
//     setSubmitResult(null);

//     try {
//         const response = await axiosClient.post(`/submission/submit/${problemId}`, {
//         code:code,
//         language: selectedLanguage
//       });

//        setSubmitResult(response.data);
//        setLoading(false);
//        setActiveRightTab('result');

//     } catch (error) {
//       console.error('Error submitting code:', error);
//       setSubmitResult(null);
//       setLoading(false);
//       setActiveRightTab('result');
//     }
//   };

//   const getLanguageForMonaco = (lang) => {
//     switch (lang) {
//       case 'javascript': return 'javascript';
//       case 'java': return 'java';
//       case 'cpp': return 'cpp';
//       default: return 'javascript';
//     }
//   };

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 'easy': return 'text-green-500';
//       case 'medium': return 'text-yellow-500';
//       case 'hard': return 'text-red-500';
//       default: return 'text-gray-500';
//     }
//   };

//   if (loading && !problem) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex bg-base-100">
//       {/* Left Panel */}
//       <div className="w-1/2 flex flex-col border-r border-base-300">
//         {/* Left Tabs */}
//         <div className="tabs tabs-bordered bg-base-200 px-4">
//           <button
//             className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`}
//             onClick={() => setActiveLeftTab('description')}
//           >
//             Description
//           </button>
//           <button
//             className={`tab ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`}
//             onClick={() => setActiveLeftTab('editorial')}
//           >
//             Editorial
//           </button>
//           <button
//             className={`tab ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`}
//             onClick={() => setActiveLeftTab('solutions')}
//           >
//             Solutions
//           </button>
//           <button
//             className={`tab ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`}
//             onClick={() => setActiveLeftTab('submissions')}
//           >
//             Submissions
//           </button>

//           <button
//             className={`tab ${activeLeftTab === 'chatAI' ? 'tab-active' : ''}`}
//             onClick={() => setActiveLeftTab('chatAI')}
//           >
//             ChatAI
//           </button>

//         </div>

//         {/* Left Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {problem && (
//             <>
//               {activeLeftTab === 'description' && (
//                 <div>
//                   <div className="flex items-center gap-4 mb-6">
//                     <h1 className="text-2xl font-bold">{problem.title}</h1>
//                     <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
//                       {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
//                     </div>
//                     <div className="badge badge-primary">{problem.tags}</div>
//                   </div>

//                   <div className="prose max-w-none">
//                     <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                       {problem.description}
//                     </div>
//                   </div>

//                   <div className="mt-8">
//                     <h3 className="text-lg font-semibold mb-4">Examples:</h3>
//                     <div className="space-y-4">
//                       {problem.visibleTestCases.map((example, index) => (
//                         <div key={index} className="bg-base-200 p-4 rounded-lg">
//                           <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
//                           <div className="space-y-2 text-sm font-mono">
//                             <div><strong>Input:</strong> {example.input}</div>
//                             <div><strong>Output:</strong> {example.output}</div>
//                             <div><strong>Explanation:</strong> {example.explanation}</div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeLeftTab === 'editorial' && (
//                 <div className="prose max-w-none">
//                   <h2 className="text-xl font-bold mb-4">Editorial</h2>
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                     <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
//                   </div>
//                 </div>
//               )}

//               {activeLeftTab === 'solutions' && (
//                 <div>
//                   <h2 className="text-xl font-bold mb-4">Solutions</h2>
//                   <div className="space-y-6">
//                     {problem.referenceSolution?.map((solution, index) => (
//                       <div key={index} className="border border-base-300 rounded-lg">
//                         <div className="bg-base-200 px-4 py-2 rounded-t-lg">
//                           <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
//                         </div>
//                         <div className="p-4">
//                           <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
//                             <code>{solution?.completeCode}</code>
//                           </pre>
//                         </div>
//                       </div>
//                     )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
//                   </div>
//                 </div>
//               )}

//               {activeLeftTab === 'submissions' && (
//                 <div>
//                   <h2 className="text-xl font-bold mb-4">My Submissions</h2>
//                   <div className="text-gray-500">
//                     <SubmissionHistory problemId={problemId} />
//                   </div>
//                 </div>
//               )}

//               {activeLeftTab === 'chatAI' && (
//                 <div className="prose max-w-none">
//                   <h2 className="text-xl font-bold mb-4">CHAT with AI</h2>
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                     <ChatAi problem={problem}></ChatAi>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Right Panel */}
//       <div className="w-1/2 flex flex-col">
//         {/* Right Tabs */}
//         <div className="tabs tabs-bordered bg-base-200 px-4">
//           <button
//             className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`}
//             onClick={() => setActiveRightTab('code')}
//           >
//             Code
//           </button>
//           <button
//             className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`}
//             onClick={() => setActiveRightTab('testcase')}
//           >
//             Testcase
//           </button>
//           <button
//             className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`}
//             onClick={() => setActiveRightTab('result')}
//           >
//             Result
//           </button>
//         </div>

//         {/* Right Content */}
//         <div className="flex-1 flex flex-col">
//           {activeRightTab === 'code' && (
//             <div className="flex-1 flex flex-col">
//               {/* Language Selector */}
//               <div className="flex justify-between items-center p-4 border-b border-base-300">
//                 <div className="flex gap-2">
//                   {['javascript', 'java', 'cpp'].map((lang) => (
//                     <button
//                       key={lang}
//                       className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
//                       onClick={() => handleLanguageChange(lang)}
//                     >
//                       {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Monaco Editor */}
//               <div className="flex-1">
//                 <Editor
//                   height="100%"
//                   language={getLanguageForMonaco(selectedLanguage)}
//                   value={code}
//                   onChange={handleEditorChange}
//                   onMount={handleEditorDidMount}
//                   theme="vs-dark"
//                   options={{
//                     fontSize: 14,
//                     minimap: { enabled: false },
//                     scrollBeyondLastLine: false,
//                     automaticLayout: true,
//                     tabSize: 2,
//                     insertSpaces: true,
//                     wordWrap: 'on',
//                     lineNumbers: 'on',
//                     glyphMargin: false,
//                     folding: true,
//                     lineDecorationsWidth: 10,
//                     lineNumbersMinChars: 3,
//                     renderLineHighlight: 'line',
//                     selectOnLineNumbers: true,
//                     roundedSelection: false,
//                     readOnly: false,
//                     cursorStyle: 'line',
//                     mouseWheelZoom: true,
//                   }}
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="p-4 border-t border-base-300 flex justify-between">
//                 <div className="flex gap-2">
//                   <button
//                     className="btn btn-ghost btn-sm"
//                     onClick={() => setActiveRightTab('testcase')}
//                   >
//                     Console
//                   </button>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`}
//                     onClick={handleRun}
//                     disabled={loading}
//                   >
//                     Run
//                   </button>
//                   <button
//                     className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}
//                     onClick={handleSubmitCode}
//                     disabled={loading}
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeRightTab === 'testcase' && (
//             <div className="flex-1 p-4 overflow-y-auto">
//               <h3 className="font-semibold mb-4">Test Results</h3>
//               {runResult ? (
//                 <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4`}>
//                   <div>
//                     {runResult.success ? (
//                       <div>
//                         <h4 className="font-bold">✅ All test cases passed!</h4>
//                         <p className="text-sm mt-2">Runtime: {runResult.runtime+" sec"}</p>
//                         <p className="text-sm">Memory: {runResult.memory+" KB"}</p>

//                         <div className="mt-4 space-y-2">
//                           {runResult.testCases.map((tc, i) => (
//                             <div key={i} className="bg-base-100 p-3 rounded text-xs">
//                               <div className="font-mono">
//                                 <div><strong>Input:</strong> {tc.stdin}</div>
//                                 <div><strong>Expected:</strong> {tc.expected_output}</div>
//                                 <div><strong>Output:</strong> {tc.stdout}</div>
//                                 <div className={'text-green-600'}>
//                                   {'✓ Passed'}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <div>
//                         <h4 className="font-bold">❌ Error</h4>
//                         <div className="mt-4 space-y-2">
//                           {runResult.testCases.map((tc, i) => (
//                             <div key={i} className="bg-base-100 p-3 rounded text-xs">
//                               <div className="font-mono">
//                                 <div><strong>Input:</strong> {tc.stdin}</div>
//                                 <div><strong>Expected:</strong> {tc.expected_output}</div>
//                                 <div><strong>Output:</strong> {tc.stdout}</div>
//                                 <div className={tc.status_id==3 ? 'text-green-600' : 'text-red-600'}>
//                                   {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-gray-500">
//                   Click "Run" to test your code with the example test cases.
//                 </div>
//               )}
//             </div>
//           )}

//           {activeRightTab === 'result' && (
//             <div className="flex-1 p-4 overflow-y-auto">
//               <h3 className="font-semibold mb-4">Submission Result</h3>
//               {submitResult ? (
//                 <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'}`}>
//                   <div>
//                     {submitResult.accepted ? (
//                       <div>
//                         <h4 className="font-bold text-lg">🎉 Accepted</h4>
//                         <div className="mt-4 space-y-2">
//                           <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
//                           <p>Runtime: {submitResult.runtime + " sec"}</p>
//                           <p>Memory: {submitResult.memory + "KB"} </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div>
//                         <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
//                         <div className="mt-4 space-y-2">
//                           <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-gray-500">
//                   Click "Submit" to submit your solution for evaluation.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProblemPage;

import { useState, useEffect, useRef } from "react";
import { NavLink, useParams } from "react-router";
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";

const langMap = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript",
};

const ProblemPage = () => {
  const { problemId } = useParams();
  const editorRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");

  // Fetch problem & initial code
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );
        const data = response.data;
        setProblem(data);

        // Try to find initial code for selectedLanguage; fallback to first available startCode
        let found = null;
        if (Array.isArray(data.startCode)) {
          found = data.startCode.find(
            (sc) =>
              typeof sc.language === "string" &&
              sc.language.toLowerCase() ===
                langMap[selectedLanguage].toLowerCase()
          );
          if (!found) found = data.startCode[0];
        }

        setCode(found?.initialCode ?? "");
      } catch (err) {
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]);

  // Update code when language switches (if problem loaded)
  useEffect(() => {
    if (!problem) return;
    if (Array.isArray(problem.startCode)) {
      const found = problem.startCode.find(
        (sc) =>
          typeof sc.language === "string" &&
          sc.language.toLowerCase() === langMap[selectedLanguage].toLowerCase()
      );
      setCode(found?.initialCode ?? problem.startCode[0]?.initialCode ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => setCode(value ?? "");

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    // Focus editor on mount
    try {
      editor.focus();
    } catch (e) {}
  };

  const handleLanguageChange = (lang) => setSelectedLanguage(lang);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    setActiveRightTab("testcase");
    try {
      const res = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setRunResult(res.data);
    } catch (err) {
      console.error("Error running code:", err);
      setRunResult({
        success: false,
        error: "Internal server error",
        testCases: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    setActiveRightTab("result");
    try {
      const res = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage,
      });
      setSubmitResult(res.data);
    } catch (err) {
      console.error("Error submitting code:", err);
      setSubmitResult({
        accepted: false,
        error: "Submission failed",
        passedTestCases: 0,
        totalTestCases: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      default:
        return "javascript";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch ((difficulty || "").toLowerCase()) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading && !problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <span className="loading loading-spinner loading-xl text-white"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-900 text-gray-100">
      {/* LEFT PANEL */}
      <aside className="w-1/2 flex flex-col border-r border-gray-800">
        {/* Left Tabs */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-850 border-b border-gray-800">
          {[
            ["description", "Description"],
            ["editorial", "Editorial"],
            ["solutions", "Solutions"],
            ["submissions", "Submissions"],
            ["chatAI", "ChatAI"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveLeftTab(key)}
              className={`text-sm px-3 py-1 rounded-md font-medium transition ${
                activeLeftTab === key
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!problem ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400">Loading problem...</span>
            </div>
          ) : (
            <>
              {activeLeftTab === "description" && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-2xl font-semibold">{problem.title}</h1>
                    <span
                      className={`px-2 py-1 rounded text-sm ${getDifficultyColor(
                        problem.difficulty
                      )} bg-gray-800 border border-gray-700`}
                    >
                      {(problem.difficulty || "").charAt(0).toUpperCase() +
                        (problem.difficulty || "").slice(1)}
                    </span>
                    <span className="px-2 py-1 rounded text-sm bg-indigo-800 text-indigo-200 border border-indigo-700">
                      {problem.tags}
                    </span>
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                      {problem.description}
                    </div>
                  </div>

                  {Array.isArray(problem.visibleTestCases) &&
                    problem.visibleTestCases.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-3">Examples</h3>
                        <div className="space-y-3">
                          {problem.visibleTestCases.map((ex, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-850 p-3 rounded-md border border-gray-800"
                            >
                              <div className="text-sm font-mono text-gray-200 mb-1">
                                <strong>Input:</strong> {ex.input}
                              </div>
                              <div className="text-sm font-mono text-gray-200 mb-1">
                                <strong>Output:</strong> {ex.output}
                              </div>
                              {ex.explanation && (
                                <div className="text-sm text-gray-300">
                                  <strong>Explanation:</strong> {ex.explanation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {activeLeftTab === "editorial" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Editorial</h2>
                  <div className="prose prose-invert max-w-none">
                    <Editorial
                      secureUrl={problem.secureUrl}
                      thumbnailUrl={problem.thumbnailUrl}
                      duration={problem.duration}
                    />
                  </div>
                </div>
              )}

              {activeLeftTab === "solutions" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Reference Solutions
                  </h2>
                  <div className="space-y-4">
                    {Array.isArray(problem.referenceSolution) &&
                    problem.referenceSolution.length > 0 ? (
                      problem.referenceSolution.map((sol, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-850 border border-gray-800 rounded-md overflow-hidden"
                        >
                          <div className="px-4 py-2 bg-gray-880 border-b border-gray-800">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">
                                {problem.title} — {sol.language}
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <pre className="bg-gray-900 p-3 rounded text-sm overflow-x-auto text-gray-200">
                              <code>{sol.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400">
                        Solutions will be visible after solving the problem.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === "submissions" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">My Submissions</h2>
                  <SubmissionHistory problemId={problemId} />
                </div>
              )}

              {activeLeftTab === "chatAI" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Chat AI</h2>
                  <ChatAi problem={problem} />
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <main className="w-1/2 flex flex-col">
        {/* Right Tabs */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-850 border-b border-gray-800">
          {[
            ["code", "Code"],
            ["testcase", "Testcase"],
            ["result", "Result"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveRightTab(key)}
              className={`text-sm px-3 py-1 rounded-md font-medium transition ${
                activeRightTab === key
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {/* CODE TAB */}
          {activeRightTab === "code" && (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-300">Language</div>
                  <div className="flex gap-2">
                    {["javascript", "java", "cpp"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`text-sm px-3 py-1 rounded-md font-medium transition ${
                          selectedLanguage === lang
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {lang === "cpp"
                          ? "C++"
                          : lang === "javascript"
                          ? "JavaScript"
                          : "Java"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveRightTab("testcase")}
                    className="text-sm px-3 py-1 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
                  >
                    Console
                  </button>

                  <button
                    onClick={handleRun}
                    disabled={loading}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                      loading
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-800 text-gray-100 hover:bg-indigo-600"
                    }`}
                  >
                    {loading ? "Running..." : "Run"}
                  </button>

                  <button
                    onClick={handleSubmitCode}
                    disabled={loading}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                      loading
                        ? "bg-gray-700 text-gray-300"
                        : "bg-indigo-600 text-white hover:bg-indigo-500"
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontSize: 13,
                    wordWrap: "on",
                    tabSize: 2,
                    folding: true,
                    lineNumbers: "on",
                    glyphMargin: false,
                    renderLineHighlight: "all",
                    scrollbar: { vertical: "auto" },
                  }}
                />
              </div>
            </>
          )}

          {/* TESTCASE TAB */}
          {activeRightTab === "testcase" && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-lg font-semibold mb-4">Test Results</h3>

              {!runResult ? (
                <div className="text-gray-400">
                  Click "Run" to execute test cases.
                </div>
              ) : (
                <div
                  className={`${
                    runResult.success
                      ? "bg-green-900/40 border border-green-700"
                      : "bg-red-900/40 border border-red-700"
                  } p-4 rounded-md`}
                >
                  <div className="mb-3">
                    <div className="text-sm font-medium">
                      {runResult.success
                        ? "All example tests passed!"
                        : runResult.error || "Some tests failed"}
                    </div>
                    {runResult.runtime && (
                      <div className="text-xs text-gray-300 mt-1">
                        Runtime: {runResult.runtime} sec • Memory:{" "}
                        {runResult.memory} KB
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {Array.isArray(runResult.testCases) &&
                      runResult.testCases.map((tc, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-850 p-3 rounded-md border border-gray-800"
                        >
                          <div className="flex items-start justify-between">
                            <div className="text-xs font-mono text-gray-200">
                              <div>
                                <strong>Input:</strong> {tc.stdin}
                              </div>
                              <div>
                                <strong>Expected:</strong> {tc.expected_output}
                              </div>
                              <div>
                                <strong>Output:</strong> {tc.stdout}
                              </div>
                            </div>
                            <div
                              className={`text-sm font-semibold ${
                                tc.status_id === 3
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {tc.status_id === 3 ? "✓ Passed" : "✗ Failed"}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RESULT TAB */}
          {activeRightTab === "result" && (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-lg font-semibold mb-4">Submission Result</h3>

              {!submitResult ? (
                <div className="text-gray-400">
                  Click "Submit" to evaluate your solution on full tests.
                </div>
              ) : (
                <div
                  className={`${
                    submitResult.accepted
                      ? "bg-green-900/40 border border-green-700"
                      : "bg-red-900/40 border border-red-700"
                  } p-4 rounded-md`}
                >
                  {submitResult.accepted ? (
                    <div>
                      <div className="text-xl font-semibold">🎉 Accepted</div>
                      <div className="mt-3 text-sm text-gray-200">
                        <div>
                          Passed: {submitResult.passedTestCases}/
                          {submitResult.totalTestCases}
                        </div>
                        <div>Runtime: {submitResult.runtime} sec</div>
                        <div>Memory: {submitResult.memory} KB</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xl font-semibold">
                        ❌ {submitResult.error || "Not Accepted"}
                      </div>
                      <div className="mt-3 text-sm text-gray-200">
                        <div>
                          Passed: {submitResult.passedTestCases}/
                          {submitResult.totalTestCases}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProblemPage;
