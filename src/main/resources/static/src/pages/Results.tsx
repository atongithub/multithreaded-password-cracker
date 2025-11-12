import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, TrendingUp, CheckCircle2, Moon, Sun, ArrowLeft, BarChart3 } from "lucide-react";
import { useTheme } from "next-themes";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useRef } from "react";

const Results = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Reactive state for job
  const [jobId, setJobId] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [result, setResult] = useState<{ id?: number; jobId?: number; crackedPassword?: string; timeTakenMs?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  // Read jobId from query string on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idStr = params.get("jobId");
    if (!idStr) return;
    const id = Number(idStr);
    if (Number.isNaN(id)) return;
    setJobId(id);
  }, []);

  // Poll status when jobId is set
  useEffect(() => {
    if (!jobId) return;
    setError(null);
    setLoading(true);

    const poll = async () => {
      try {
        const resp = await fetch(`/api/status/${jobId}`);
        if (!resp.ok) {
          throw new Error(`Status fetch failed: ${resp.status} ${resp.statusText}`);
        }
        const text = await resp.text();
        setStatus(text);

        if (text === "FOUND") {
          // fetch the result
          const r = await fetch(`/api/result/${jobId}`);
          if (!r.ok) {
            throw new Error(`Result fetch failed: ${r.status} ${r.statusText}`);
          }
          const json = await r.json();
          setResult(json);
          setLoading(false);
          // stop polling
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        } else if (text === "NOT_FOUND" || text === "FAILED" || text === "DB_ERROR") {
          setLoading(false);
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        } else {
          // still running; keep polling
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || String(err));
        setLoading(false);
      }
    };

    // initial poll and interval
    poll();
    pollRef.current = window.setInterval(poll, 2000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [jobId]);

  const handleRefresh = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const resp = await fetch(`/api/status/${jobId}`);
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
      const s = await resp.text();
      setStatus(s);
      if (s === "FOUND") {
        const r = await fetch(`/api/result/${jobId}`);
        const json = await r.json();
        setResult(json);
      }
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Analysis Results</h1>
              <p className="text-xs text-muted-foreground">Performance Dashboard</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job</CardTitle>
            <CardDescription>Realtime job status and results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p><strong>Job ID:</strong> {jobId ?? '-'} </p>
              <p><strong>Status:</strong> {status ?? 'Unknown'}</p>
              {error && <p className="text-destructive">Error: {error}</p>}
              {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

              <div className="flex gap-2">
                <Button onClick={handleRefresh} disabled={!jobId || loading}>Refresh</Button>
                <Button variant="outline" onClick={() => navigate('/upload')}>Upload another</Button>
              </div>

              {status === 'FOUND' && result && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Result</h3>
                  <p><strong>Cracked Password:</strong> {result.crackedPassword}</p>
                  <p><strong>Time (ms):</strong> {result.timeTakenMs}</p>
                </div>
              )}

              {status === 'NOT_FOUND' && !result && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Result</h3>
                  <p>Password not found in the selected wordlist.</p>
                </div>
              )}

              {status && (status !== 'FOUND' && status !== 'NOT_FOUND') && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Progress</h3>
                  <p>Current status: {status}</p>
                  <Progress value={25} className="mt-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* If result present, show some summary statistics */}
        {result && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>Job execution details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cracked Password</p>
                  <p className="font-mono font-semibold break-words">{result.crackedPassword}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Taken (ms)</p>
                  <p className="font-semibold">{result.timeTakenMs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  );
};

export default Results;
