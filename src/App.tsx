import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TripsProvider } from "@/context/TripsContext";
import { AppShell } from "@/components/layout/AppShell";
import Dashboard from "@/routes/index";
import TripsPage from "@/routes/trips.index";
import NewTripPage from "@/routes/trips.new";
import EditTripPage from "@/routes/trips.$id.edit";
import StatsPage from "@/routes/stats";
import RecordsPage from "@/routes/records";

export default function App() {
  return (
    <TripsProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/new" element={<NewTripPage />} />
            <Route path="/trips/:id/edit" element={<EditTripPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TripsProvider>
  );
}
