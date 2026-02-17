import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

// Import the toast library
import { toast, toastAdvanced } from "@editora/toast";
import "../../packages/editora-toast/dist/toast.css";

const meta: Meta = {
  title: "UI Components/Toast Notifications",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Editora Toast - Advanced Notification System

**Bundle Size**: ~22 KB minified (5.6 KB gzipped)  
**Features**: Promise lifecycle, progress bars, groups, plugins, accessibility  
**Zero Dependencies**: Framework agnostic, works everywhere  

## Features
- ✅ Promise lifecycle toasts (loading → success/error)
- ✅ Progress bars with percentage display
- ✅ Toast groups and stacking
- ✅ Custom rendering and actions
- ✅ Accessibility (ARIA, keyboard navigation)
- ✅ Themes (light/dark/system)
- ✅ Plugins system
- ✅ Multiple positions
- ✅ Auto-dismiss with pause on hover
- ✅ Drag/swipe to dismiss
        `,
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["light", "dark", "system", "custom", "colored", "minimal", "glass", "neon", "retro", "ocean", "forest", "sunset", "midnight"],
      description: "Toast theme",
    },
    position: {
      control: { type: "select" },
      options: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"],
      description: "Toast position",
    },
    rtl: {
      control: { type: "boolean" },
      description: "Enable RTL (right-to-left) support",
    },
    swipeDirection: {
      control: { type: "select" },
      options: ["any", "horizontal", "vertical", "left", "right", "up", "down"],
      description: "Swipe direction for dismiss",
    },
    pauseOnWindowBlur: {
      control: { type: "boolean" },
      description: "Pause toasts when window loses focus",
    },
  },
};

export default meta;
type Story = StoryObj;

const ToastDemo = ({ 
  theme = "light", 
  position = "bottom-right",
  rtl = false,
  swipeDirection = "any",
  pauseOnWindowBlur = false
}: { 
  theme?: string; 
  position?: string;
  rtl?: boolean;
  swipeDirection?: string;
  pauseOnWindowBlur?: boolean;
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize toast with demo settings
    toastAdvanced.configure({
      theme: theme as any,
      position: position as any,
      duration: 4000,
      maxVisible: 5,
      enableAccessibility: true,
      rtl,
      swipeDirection: swipeDirection as any,
      pauseOnWindowBlur,
    });
    setIsInitialized(true);
  }, [theme, position, rtl, swipeDirection, pauseOnWindowBlur]);

  if (!isInitialized) {
    return <div>Initializing toast system...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h1>Toast Notifications Demo</h1>
      <p>Click the buttons below to see different toast types and features.</p>

      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {/* Basic Toasts */}
        <div>
          <h3>Basic Toasts</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button onClick={() => toast.info("This is an info message", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any })}>
              Info Toast
            </button>
            <button
              onClick={() => toast.success("Operation completed successfully!", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any })}
            >
              Success Toast
            </button>
            <button onClick={() => toast.error("Something went wrong!", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any })}>
              Error Toast
            </button>
            <button onClick={() => toastAdvanced.warning("This is a warning", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any })}>
              Warning Toast
            </button>
            <button onClick={() => toastAdvanced.loading("Loading content...", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any })}>
              Loading Toast
            </button>
          </div>
        </div>

        {/* Rich Toasts */}
        <div>
          <h3>Rich Toasts</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Document saved successfully!",
                  level: "success",
                  icon: "💾",
                  actions: [
                    {
                      label: "View Document",
                      onClick: () => alert("Viewing document..."),
                    },
                    { label: "Share", onClick: () => alert("Sharing...") },
                  ],
                });
              }}
            >
              Rich Toast with Actions
            </button>

            <button
              onClick={() => {
                toastAdvanced.show({
                  render: () => {
                    const div = document.createElement("div");
                    div.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-size: 20px;">🎨</span>
                      <div>
                        <strong>Custom Toast</strong>
                        <br>
                        <small>Rendered with custom function</small>
                      </div>
                    </div>
                  `;
                    return div;
                  },
                  level: "custom",
                });
              }}
            >
              Custom Render Toast
            </button>
          </div>
        </div>

        {/* Progress Toasts */}
        <div>
          <h3>Progress Toasts</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                const toastInstance = toastAdvanced.show({
                  message: "Processing...",
                  level: "loading",
                  progress: { value: 0, showPercentage: true },
                });

                let progress = 0;
                const interval = setInterval(() => {
                  progress += 10;
                  toastAdvanced.update(toastInstance.id, {
                    progress: { value: progress, showPercentage: true },
                    message: `Processing... ${progress}%`,
                  });

                  if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                      toastAdvanced.update(toastInstance.id, {
                        message: "Complete!",
                        level: "success",
                        progress: undefined,
                      });
                    }, 500);
                  }
                }, 200);
              }}
            >
              Progress Toast
            </button>

            <button
              onClick={() => {
                const toastInstance = toastAdvanced.show({
                  message: "Downloading...",
                  level: "loading",
                  progress: { value: 0 },
                });

                let progress = 0;
                const interval = setInterval(() => {
                  progress += 5;
                  toastAdvanced.update(toastInstance.id, {
                    progress: { value: progress },
                  });

                  if (progress >= 100) {
                    clearInterval(interval);
                    toastAdvanced.update(toastInstance.id, {
                      message: "Download complete!",
                      level: "success",
                      progress: undefined,
                    });
                  }
                }, 100);
              }}
            >
              Download Progress
            </button>
          </div>
        </div>
        {/* Theme Showcase */}
        <div>
          <h3>Theme Showcase</h3>
          <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            {[
              { name: "Colored", theme: "colored" },
              { name: "Minimal", theme: "minimal" },
              { name: "Glass", theme: "glass" },
              { name: "Neon", theme: "neon" },
              { name: "Retro", theme: "retro" },
              { name: "Ocean", theme: "ocean" },
              { name: "Forest", theme: "forest" },
              { name: "Sunset", theme: "sunset" },
              { name: "Midnight", theme: "midnight" }
            ].map(({ name, theme }) => (
              <div key={theme} style={{ border: "1px solid #e1e5e9", borderRadius: "8px", padding: "15px" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>{name} Theme</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button onClick={() => {
                    const toast = toastAdvanced.show({
                      message: `${name} theme - Success!`,
                      level: "success",
                      theme: theme as any
                    });
                  }}>
                    Success
                  </button>
                  <button onClick={() => {
                    const toast = toastAdvanced.show({
                      message: `${name} theme - Info message`,
                      level: "info",
                      theme: theme as any
                    });
                  }}>
                    Info
                  </button>
                  <button onClick={() => {
                    const toast = toastAdvanced.show({
                      message: `${name} theme - Warning!`,
                      level: "warning",
                      theme: theme as any
                    });
                  }}>
                    Warning
                  </button>
                  <button onClick={() => {
                    const toast = toastAdvanced.show({
                      message: `${name} theme - Error occurred`,
                      level: "error",
                      theme: theme as any
                    });
                  }}>
                    Error
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3>Advanced Animations</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Spring animation toast!",
                  level: "success",
                  animation: {
                    type: "spring",
                    config: { stiffness: 100, damping: 20 },
                  },
                });
              }}
            >
              Spring Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Bounce animation!",
                  level: "info",
                  animation: {
                    type: "bounce",
                    direction: "up",
                    intensity: "normal",
                    duration: 800,
                  },
                });
              }}
            >
              Bounce Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Slide animation!",
                  level: "success",
                  animation: {
                    type: "slide",
                    direction: "up",
                    distance: 100,
                    duration: 400,
                  },
                });
              }}
            >
              Slide Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Zoom animation!",
                  level: "warning",
                  animation: {
                    type: "zoom",
                    scale: 0.3,
                    origin: "center",
                    duration: 500,
                  },
                });
              }}
            >
              Zoom Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Flip animation!",
                  level: "error",
                  animation: {
                    type: "flip",
                    axis: "y",
                    direction: "forward",
                    duration: 600,
                  },
                });
              }}
            >
              Flip Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Fade animation!",
                  level: "info",
                  animation: {
                    type: "fade",
                    direction: "up",
                    distance: 20,
                    duration: 300,
                  },
                });
              }}
            >
              Fade Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Elastic animation!",
                  level: "success",
                  animation: {
                    type: "elastic",
                    direction: "up",
                    intensity: "normal",
                    duration: 1000,
                  },
                });
              }}
            >
              Elastic Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Rotate animation!",
                  level: "warning",
                  animation: {
                    type: "rotate",
                    degrees: 360,
                    direction: "clockwise",
                    duration: 500,
                  },
                });
              }}
            >
              Rotate Animation
            </button>
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "Custom bounce animation!",
                  level: "info",
                  animation: {
                    type: "custom",
                    show: async (element) => {
                      // Custom bounce animation
                      element.style.transform = "scale(0.3)";
                      element.style.opacity = "0";

                      await new Promise((resolve) => setTimeout(resolve, 50));
                      element.style.transition =
                        "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
                      element.style.transform = "scale(1)";
                      element.style.opacity = "1";

                      return new Promise((resolve) => setTimeout(resolve, 600));
                    },
                    hide: async (element) => {
                      element.style.transition = "all 0.4s ease";
                      element.style.transform = "scale(0.8)";
                      element.style.opacity = "0";
                      return new Promise((resolve) => setTimeout(resolve, 400));
                    },
                  },
                });
              }}
            >
              Custom Bounce Animation
            </button>
          </div>
        </div>

        {/* Promise Toasts */}
        <div>
          <h3>Promise Lifecycle Toasts</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                const promise = new Promise((resolve) => {
                  setTimeout(() => resolve("Data loaded successfully!"), 2000);
                });

                toastAdvanced
                  .promise(promise, {
                    loading: "Loading data...",
                    success: (data) => `Success: ${data}`,
                    error: "Failed to load data",
                  })
                  .catch(() => {});
              }}
            >
              Successful Promise
            </button>

            <button
              onClick={() => {
                const promise = new Promise((_, reject) => {
                  setTimeout(() => reject(new Error("Network error")), 2000);
                });

                toastAdvanced
                  .promise(promise, {
                    loading: "Loading data...",
                    success: "Data loaded!",
                    error: (error) => `Error: ${error.message}`,
                  })
                  .catch(() => {});
              }}
            >
              Failed Promise
            </button>
          </div>
        </div>

        {/* Grouped Toasts */}
        <div>
          <h3>Grouped Toasts</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                toastAdvanced.group("upload-group", {
                  message: "Upload 1 of 3 complete",
                  level: "success",
                });

                setTimeout(() => {
                  toastAdvanced.group("upload-group", {
                    message: "Upload 2 of 3 complete",
                    level: "success",
                  });
                }, 1000);

                setTimeout(() => {
                  toastAdvanced.group("upload-group", {
                    message: "All uploads complete!",
                    level: "success",
                  });
                }, 2000);
              }}
            >
              Grouped Uploads
            </button>
          </div>
        </div>

        {/* File Upload Simulation */}
        <div>
          <h3>File Upload Simulation</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                const uploadPromise = new Promise((resolve, reject) => {
                  let progress = 0;
                  const interval = setInterval(() => {
                    progress += 20;
                    if (progress >= 100) {
                      clearInterval(interval);
                      resolve("File uploaded successfully!");
                    }
                  }, 300);

                  setTimeout(() => {
                    if (Math.random() > 0.7) {
                      clearInterval(interval);
                      reject(new Error("Upload failed"));
                    }
                  }, 1000);
                });

                toastAdvanced
                  .promise(uploadPromise, {
                    loading: "Uploading file...",
                    success: "File uploaded successfully!",
                    error: "Upload failed. Please try again.",
                  })
                  .catch(() => {});
              }}
            >
              File Upload
            </button>
          </div>
        </div>

        {/* Positioned Toasts */}
        <div>
          <h3>Positioned Toasts</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {[
              "top-left",
              "top-center",
              "top-right",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ].map((pos) => (
              <button
                key={pos}
                onClick={() => {
                  toastAdvanced.show({
                    message: `Toast at ${pos}`,
                    level: "info",
                    position: pos as any,
                  });
                }}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div>
          <h3>Configuration</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                toastAdvanced.show({
                  message: "This toast will not auto-hide",
                  level: "warning",
                  persistent: true, // No auto-dismiss
                  closable: true,
                });
              }}
            >
              No Auto Hide
            </button>
            <button
              onClick={() => {
                toastAdvanced.configure({ duration: 2000 });
                toast.info("Fast duration set (2s)", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any });
              }}
            >
              Fast Duration (2s)
            </button>

            <button
              onClick={() => {
                toastAdvanced.configure({ duration: 10000 });
                toast.info("Slow duration set (10s)", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any });
              }}
            >
              Slow Duration (10s)
            </button>

            <button
              onClick={() => {
                toastAdvanced.configure({ maxVisible: 2 });
                toast.info("Max visible set to 2", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any });
              }}
            >
              Max Visible: 2
            </button>

            <button
              onClick={() => {
                toastAdvanced.configure({
                  duration: 4000,
                  maxVisible: 5,
                  position: "bottom-right",
                });
                toast.info("Configuration reset", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any });
              }}
            >
              Reset Config
            </button>
          </div>
        </div>

        {/* Update Toast */}
        <div>
          <h3>Update Toast</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                const loadingToast =
                  toastAdvanced.loading("Saving document...");
                setTimeout(() => {
                  toastAdvanced.update(loadingToast.id, {
                    message: "Document saved successfully!",
                    level: "success",
                  });
                }, 2000);
              }}
            >
              Loading → Success
            </button>
          </div>
        </div>

        {/* Plugin Demo */}
        <div>
          <h3>Plugin Demo</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              onClick={() => {
                const analyticsPlugin = {
                  name: "analytics",
                  install(manager: any) {
                    manager.on("afterShow", (toast: any) => {
                      console.log("📊 Toast shown:", {
                        level: toast.level,
                        message: toast.message,
                        timestamp: new Date().toISOString(),
                      });
                    });
                  },
                };

                toastAdvanced.use(analyticsPlugin);
                toast.success("Analytics plugin installed! Check console.", { theme: theme as any, position: position as any, rtl, swipeDirection: swipeDirection as any });
              }}
            >
              Install Analytics Plugin
            </button>

            <button
              onClick={() => {
                toastAdvanced.info(
                  "This toast will be tracked by analytics plugin",
                );
              }}
            >
              Toast with Plugin
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h3>Toast State</h3>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <strong>Toasts:</strong> {toastAdvanced.getToasts().length}
          </div>
          <div>
            <strong>Groups:</strong>{" "}
            {Object.keys(toastAdvanced.getGroups()).length}
          </div>
          <div>
            <strong>Config:</strong>
            <pre style={{ fontSize: "12px", margin: "5px 0" }}>
              {JSON.stringify(toastAdvanced.getConfig(), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main demo story
export const ToastShowcase: Story = {
  render: (args) => <ToastDemo theme={args.theme} position={args.position} />,
  args: {
    theme: "light",
    position: "bottom-right",
  },
};

// Individual feature stories
export const BasicToasts: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Basic Toast Types</h2>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button onClick={() => toast.info("Info message", { theme: 'light', position: 'bottom-right' })}>Info</button>
        <button onClick={() => toast.success("Success message", { theme: 'light', position: 'bottom-right' })}>Success</button>
        <button onClick={() => toast.error("Error message", { theme: 'light', position: 'bottom-right' })}>Error</button>
        <button onClick={() => toastAdvanced.warning("Warning message", { theme: 'light', position: 'bottom-right' })}>Warning</button>
        <button onClick={() => toastAdvanced.loading("Loading message", { theme: 'light', position: 'bottom-right' })}>Loading</button>
      </div>
    </div>
  ),
};

export const PromiseToasts: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Promise Lifecycle Toasts</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => {
          const promise = new Promise((resolve) => {
            setTimeout(() => resolve("Data loaded!"), 2000);
          });
          toastAdvanced.promise(promise, {
            loading: "Loading...",
            success: (data) => `Success: ${data}`,
            error: "Failed"
          }).catch(() => {});
        }}>
          Success Promise
        </button>
        <button onClick={() => {
          const promise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Network error")), 2000);
          });
          toastAdvanced.promise(promise, {
            loading: "Loading...",
            success: "Success!",
            error: (error) => `Error: ${error.message}`
          }).catch(() => {});
        }}>
          Failed Promise
        </button>
      </div>
    </div>
  ),
};

export const ProgressToasts: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Progress Toasts</h2>
      <button onClick={() => {
        const toastInstance = toastAdvanced.show({
          message: "Processing...",
          level: "loading",
          progress: { value: 0, showPercentage: true }
        });

        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          toastAdvanced.update(toastInstance.id, {
            progress: { value: progress, showPercentage: true },
            message: `Processing... ${progress}%`
          });

          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              toastAdvanced.update(toastInstance.id, {
                message: "Complete!",
                level: "success",
                progress: undefined
              });
            }, 500);
          }
        }, 200);
      }}>
        Start Progress
      </button>
    </div>
  ),
};

// New Features Demo
export const NewFeaturesDemo: Story = {
  render: (args) => <ToastDemo 
    theme={args.theme} 
    position={args.position}
    rtl={args.rtl}
    swipeDirection={args.swipeDirection}
    pauseOnWindowBlur={args.pauseOnWindowBlur}
  />,
  args: {
    theme: "light",
    position: "bottom-right",
    rtl: false,
    swipeDirection: "any",
    pauseOnWindowBlur: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
# New Features Demo

This story demonstrates the newly added features:

## RTL Support
- Enable RTL support with the \`rtl\` prop
- Automatically adjusts text direction and layout for right-to-left languages

## Swipe Direction Control
- Choose specific swipe directions: \`any\`, \`horizontal\`, \`vertical\`, \`left\`, \`right\`, \`up\`, \`down\`
- More precise control over how users can dismiss toasts

## Window Focus Pausing
- Enable \`pauseOnWindowBlur\` to automatically pause toasts when the window loses focus
- Resumes when the window regains focus
- Useful for preventing toasts from disappearing while users are in other tabs
        `,
      },
    },
  },
};

// Complex Examples Stories
export const InteractiveFeedbackForm: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Interactive Feedback Form</h2>
      <p>Toast containing a textarea and submit/cancel buttons for user feedback.</p>
      <button onClick={() => {
        const feedbackForm = document.createElement('div');
        feedbackForm.style.cssText = `
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 280px;
        `;

        const title = document.createElement('div');
        title.textContent = '💬 Quick Feedback';
        title.style.cssText = `
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          color: inherit;
        `;

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'How can we improve Editora?';
        textarea.style.cssText = `
          width: 100%;
          min-height: 60px;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: inherit;
          font-size: 13px;
          font-family: inherit;
          resize: vertical;
          outline: none;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
          display: flex;
          gap: 6px;
          justify-content: flex-end;
          margin-top: 4px;
        `;

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Send';
        submitBtn.style.cssText = `
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 4px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        `;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
          padding: 6px 12px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 4px;
          color: inherit;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        `;

        // Button hover effects
        submitBtn.onmouseover = () => {
          submitBtn.style.background = 'rgba(255, 255, 255, 0.3)';
          submitBtn.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        };
        submitBtn.onmouseout = () => {
          submitBtn.style.background = 'rgba(255, 255, 255, 0.2)';
          submitBtn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        };

        cancelBtn.onmouseover = () => {
          cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
          cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.8)';
        };
        cancelBtn.onmouseout = () => {
          cancelBtn.style.background = 'transparent';
          cancelBtn.style.borderColor = 'rgba(255, 255, 255, 0.6)';
        };

        // Form submission
        const handleSubmit = () => {
          const feedback = textarea.value.trim();
          if (!feedback) {
            feedbackForm.innerHTML = `
              <div style="text-align: center; color: inherit;">
                <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                <div style="font-weight: 500; margin-bottom: 4px;">Please enter your feedback</div>
                <div style="font-size: 12px; opacity: 0.8;">We'd love to hear your thoughts!</div>
              </div>
            `;
            setTimeout(() => {
              // In Storybook, we can't access the toast instance directly
              console.log('Feedback form validation error');
            }, 2000);
            return;
          }

          feedbackForm.innerHTML = `
            <div style="text-align: center; color: inherit;">
              <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
              <div style="font-weight: 500; margin-bottom: 4px;">Thank you for your feedback!</div>
              <div style="font-size: 12px; opacity: 0.8;">We'll review your suggestions soon.</div>
            </div>
          `;

          console.log('Feedback received:', feedback);
        };

        const handleCancel = () => {
          console.log('Feedback form cancelled');
        };

        // Event listeners
        submitBtn.onclick = handleSubmit;
        cancelBtn.onclick = handleCancel;

        textarea.onkeydown = (e) => {
          if (e.key === 'Enter' && e.ctrlKey) {
            handleSubmit();
          } else if (e.key === 'Escape') {
            handleCancel();
          }
        };

        // Assemble form
        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(submitBtn);

        feedbackForm.appendChild(title);
        feedbackForm.appendChild(textarea);
        feedbackForm.appendChild(buttonContainer);

        toastAdvanced.show({
          render: () => feedbackForm,
          level: 'info',
          duration: 0,
          closable: true
        });
      }}>
        Show Feedback Form
      </button>
    </div>
  ),
};

export const SystemNotifications: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>System Notifications</h2>
      <p>Different types of system notifications with appropriate actions.</p>
      <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <button onClick={() => {
          toastAdvanced.show({
            message: '🎉 System update v2.1.0 is now available! New features include enhanced accessibility and improved performance.',
            level: 'success',
            actions: [
              { label: 'Update Now', primary: true, onClick: () => console.log('Update started') },
              { label: 'Later', onClick: () => console.log('Update scheduled') }
            ]
          });
        }}>
          System Update
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '⚠️ Low disk space detected. Only 2.3 GB remaining. Consider freeing up space or upgrading storage.',
            level: 'warning',
            actions: [
              { label: 'Free Space', primary: true, onClick: () => console.log('Storage cleanup started') },
              { label: 'Dismiss', onClick: () => {} }
            ]
          });
        }}>
          Low Disk Space
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '❌ Internet connection lost. Some features may not work properly. Please check your network settings.',
            level: 'error',
            actions: [
              { label: 'Retry', primary: true, onClick: () => console.log('Retrying connection') },
              { label: 'Settings', onClick: () => console.log('Opening network settings') }
            ]
          });
        }}>
          Connection Lost
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '💬 You have 3 unread messages from the development team. Click to view them.',
            level: 'info',
            actions: [
              { label: 'View Messages', primary: true, onClick: () => console.log('Messages opened') },
              { label: 'Mark Read', onClick: () => console.log('Messages marked as read') }
            ]
          });
        }}>
          New Messages
        </button>
      </div>
    </div>
  ),
};

export const BulkNotifications: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Bulk Notifications</h2>
      <p>Multiple notifications appearing in sequence.</p>
      <button onClick={() => {
        const notifications = [
          { message: '📧 New email from support@editora.dev', level: 'info', delay: 0 },
          { message: '🔄 Database backup completed successfully', level: 'success', delay: 500 },
          { message: '⚠️ High CPU usage detected on server-01', level: 'warning', delay: 1000 }
        ];

        notifications.forEach(notification => {
          setTimeout(() => {
            toastAdvanced.show({
              ...notification,
              duration: 6000,
              position: 'top-right'
            });
          }, notification.delay);
        });
      }}>
        Show Bulk Notifications
      </button>
    </div>
  ),
};

export const PriorityNotifications: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Priority Notifications</h2>
      <p>High-priority notifications that require immediate attention.</p>
      <button onClick={() => {
        toastAdvanced.show({
          message: '🚨 CRITICAL: Security vulnerability detected! Immediate action required.',
          level: 'error',
          priority: 100,
          duration: 0,
          actions: [
            { label: 'Fix Now', primary: true, onClick: () => console.log('Security patch applied') },
            { label: 'Learn More', onClick: () => console.log('Opening security documentation') }
          ]
        });
      }}>
        Show Critical Alert
      </button>
    </div>
  ),
};

export const PersistentNotifications: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Persistent Notifications</h2>
      <p>Notifications that stay until manually dismissed.</p>
      <button onClick={() => {
        toastAdvanced.show({
          message: '📌 This notification will stay until manually dismissed. Perfect for important announcements.',
          level: 'info',
          persistent: true,
          actions: [
            { label: 'Got it!', primary: true, onClick: () => {} },
            { label: 'Learn More', onClick: () => console.log('Opening help documentation') }
          ]
        });
      }}>
        Show Persistent Notification
      </button>
    </div>
  ),
};

export const AdvancedProgressScenarios: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Advanced Progress Scenarios</h2>
      <p>Complex progress tracking with multiple stages and real-time updates.</p>
      <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <button onClick={() => {
          const toast = toastAdvanced.show({
            message: '📁 Uploading document.pdf...',
            level: 'loading',
            progress: { value: 0, showPercentage: true },
            duration: 15000
          });

          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              toastAdvanced.update(toast.id, {
                message: '✅ document.pdf uploaded successfully!',
                level: 'success',
                progress: undefined
              });
            } else {
              toastAdvanced.update(toast, {
                progress: { value: progress, showPercentage: true }
              });
            }
          }, 800);
        }}>
          File Upload Progress
        </button>

        <button onClick={() => {
          const steps = [
            '🔍 Analyzing files...',
            '📊 Processing data...',
            '🔄 Optimizing content...',
            '✅ Finalizing results...'
          ];

          let currentStep = 0;
          const toast = toastAdvanced.show({
            message: steps[0],
            level: 'loading',
            progress: { value: 0 },
            duration: 12000
          });

          const interval = setInterval(() => {
            currentStep++;
            const progress = (currentStep / steps.length) * 100;

            if (currentStep >= steps.length) {
              clearInterval(interval);
              toastAdvanced.update(toast.id, {
                message: '🎉 All steps completed successfully!',
                level: 'success',
                progress: undefined
              });
            } else {
              toastAdvanced.update(toast.id, {
                message: steps[currentStep],
                progress: { value: progress }
              });
            }
          }, 2500);
        }}>
          Multi-Step Process
        </button>

        <button onClick={() => {
          const toast = toastAdvanced.show({
            message: '⬇️ Downloading update.zip (0 MB/s)',
            level: 'loading',
            progress: { value: 0, showPercentage: true },
            duration: 10000
          });

          let progress = 0;
          let speed = 2.1;
          const interval = setInterval(() => {
            progress += Math.random() * 8 + 2;
            speed = Math.max(0.5, speed + (Math.random() - 0.5) * 0.5);

            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              toastAdvanced.update(toast.id, {
                message: '✅ update.zip downloaded successfully!',
                level: 'success',
                progress: undefined
              });
            } else {
              toastAdvanced.update(toast.id, {
                message: `⬇️ Downloading update.zip (${speed.toFixed(1)} MB/s)`,
                progress: { value: progress, showPercentage: true }
              });
            }
          }, 600);
        }}>
          Download with Speed
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '🔄 Synchronizing with cloud...',
            level: 'loading',
            progress: { indeterminate: true },
            duration: 8000
          });
        }}>
          Indeterminate Progress
        </button>
      </div>
    </div>
  ),
};

export const InteractiveActions: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Interactive Actions</h2>
      <p>Toasts with multiple action buttons for complex user interactions.</p>
      <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <button onClick={() => {
          toastAdvanced.show({
            message: '🔄 Are you sure you want to delete this file? This action cannot be undone.',
            level: 'warning',
            actions: [
              { label: 'Delete', primary: true, onClick: () => console.log('File deleted permanently') },
              { label: 'Cancel', onClick: () => console.log('Operation cancelled') }
            ]
          });
        }}>
          Confirm Action
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '❌ Failed to save document. Would you like to retry or save locally?',
            level: 'error',
            actions: [
              { label: 'Retry', primary: true, onClick: () => console.log('Retrying save operation') },
              { label: 'Save Locally', onClick: () => console.log('Document saved locally') }
            ]
          });
        }}>
          Retry Failed Operation
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '⬆️ A new version (v2.1.0) is available. Update now to get the latest features and security fixes.',
            level: 'info',
            actions: [
              { label: 'Update Now', primary: true, onClick: () => console.log('Installing update') },
              { label: 'Later', onClick: () => console.log('Update scheduled for next restart') },
              { label: 'What\'s New', onClick: () => console.log('New features: Enhanced themes, better accessibility, improved performance') }
            ]
          });
        }}>
          Update Available
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '📊 How satisfied are you with Editora Toast?',
            level: 'info',
            actions: [
              { label: '😍 Very Satisfied', onClick: () => console.log('Thank you for the feedback!') },
              { label: '😊 Satisfied', onClick: () => console.log('Thank you for the feedback!') },
              { label: '😐 Neutral', onClick: () => console.log('We\'ll work on improving!') },
              { label: '😕 Dissatisfied', onClick: () => console.log('Sorry to hear that. Please share your concerns.') }
            ]
          });
        }}>
          Quick Survey
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '⚖️ Choose your preferred notification position for future updates.',
            level: 'info',
            actions: [
              { label: 'Top Right', onClick: () => {
                toastAdvanced.configure({ position: 'top-right' });
                console.log('Position updated to top-right');
              }},
              { label: 'Bottom Right', onClick: () => {
                toastAdvanced.configure({ position: 'bottom-right' });
                console.log('Position updated to bottom-right');
              }},
              { label: 'Top Left', onClick: () => {
                toastAdvanced.configure({ position: 'top-left' });
                console.log('Position updated to top-left');
              }}
            ]
          });
        }}>
          Decision Required
        </button>
      </div>
    </div>
  ),
};

export const ErrorHandlingScenarios: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Error Handling Scenarios</h2>
      <p>Different error types with appropriate recovery options.</p>
      <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <button onClick={() => {
          toastAdvanced.show({
            message: '🌐 Unable to connect to the server. Please check your internet connection and try again.',
            level: 'error',
            actions: [
              { label: 'Retry', primary: true, onClick: () => console.log('Retrying connection') },
              { label: 'Settings', onClick: () => console.log('Opening network settings') }
            ]
          });
        }}>
          Network Error
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '❌ Please correct the following errors: Email format invalid, Password too short (min 8 characters).',
            level: 'error',
            actions: [
              { label: 'Fix Issues', primary: true, onClick: () => console.log('Highlighting error fields') }
            ]
          });
        }}>
          Validation Error
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '🔒 Permission denied. You need administrator privileges to perform this action.',
            level: 'error',
            actions: [
              { label: 'Request Access', primary: true, onClick: () => console.log('Access request sent to administrator') },
              { label: 'Learn More', onClick: () => console.log('Opening permissions documentation') }
            ]
          });
        }}>
          Permission Denied
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '⏰ Operation timed out. The server took too long to respond.',
            level: 'error',
            actions: [
              { label: 'Retry', primary: true, onClick: () => console.log('Retrying operation') },
              { label: 'Cancel', onClick: () => console.log('Operation cancelled') }
            ]
          });
        }}>
          Timeout Error
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '🖥️ Server error (500). Something went wrong on our end. Our team has been notified.',
            level: 'error',
            actions: [
              { label: 'Try Again', primary: true, onClick: () => console.log('Retrying request') },
              { label: 'Report Issue', onClick: () => console.log('Bug report submitted') }
            ]
          });
        }}>
          Server Error (500)
        </button>

        <button onClick={() => {
          toastAdvanced.show({
            message: '🚦 Too many requests. Please wait a moment before trying again.',
            level: 'warning',
            actions: [
              { label: 'Wait & Retry', primary: true, onClick: () => {
                setTimeout(() => console.log('Ready to retry'), 3000);
              }}
            ]
          });
        }}>
          Rate Limited
        </button>
      </div>
    </div>
  ),
};

export const AsyncOperations: Story = {
  render: () => (
    <div style={{ padding: "20px" }}>
      <h2>Async Operations</h2>
      <p>Promise-based operations with loading states and success/error handling.</p>
      <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <button onClick={() => {
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
              Math.random() > 0.1 ? resolve({ data: 'Sample API response', status: 200 }) : reject(new Error('Network Error'));
            }, 2000);
          });

          toastAdvanced.promise(promise, {
            loading: '🔄 Making API request...',
            success: (data) => `✅ API call successful! Status: ${data.status}`,
            error: (error) => `❌ API call failed: ${error.message}`
          }).catch(() => {});
        }}>
          Successful API Call
        </button>

        <button onClick={() => {
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
              Math.random() > 0.3 ? resolve('File processed successfully') : reject(new Error('File corrupted'));
            }, 2500);
          });

          toastAdvanced.promise(promise, {
            loading: '📄 Processing file...',
            success: (message) => `✅ ${message}`,
            error: (error) => `❌ File operation failed: ${error.message}`
          }).catch(() => {});
        }}>
          File Operation
        </button>

        <button onClick={() => {
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
              Math.random() > 0.2 ? resolve({ transactionId: 'TXN_' + Date.now() }) : reject(new Error('Payment declined'));
            }, 3000);
          });

          toastAdvanced.promise(promise, {
            loading: '💳 Processing payment...',
            success: (data) => `✅ Payment successful! Transaction ID: ${data.transactionId}`,
            error: (error) => `❌ Payment failed: ${error.message}`
          }).catch(() => {});
        }}>
          Payment Processing
        </button>

        <button onClick={() => {
          const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
              Math.random() > 0.1 ? resolve('Data synchronized') : reject(new Error('Sync conflict detected'));
            }, 3500);
          });

          toastAdvanced.promise(promise, {
            loading: '🔄 Synchronizing data...',
            success: (message) => `✅ ${message} with cloud`,
            error: (error) => `❌ Sync failed: ${error.message}`
          }).catch(() => {});
        }}>
          Data Synchronization
        </button>
      </div>
    </div>
  ),
};
