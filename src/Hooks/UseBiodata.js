import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Biodata } from "../API/UserBiodata.Api";

// Query key constant — keeps cache keys consistent across the app
const BIODATA_KEY = "biodatas";

// ── GET ALL (useQuery — runs automatically on mount) ─────────────────────────
export const useGetAllBiodata = () => {
  return useQuery({
    queryKey: [BIODATA_KEY],
    queryFn: async () => {
      const res = await Biodata.GetAllBiodata();
      return res.data.data;
    },
  });
};

// ── GET BY ID (useQuery — pass the id, runs when id is available) ────────────
export const useGetBiodataById = (id) => {
  return useQuery({
    queryKey: [BIODATA_KEY, id],
    queryFn: async () => {
      const res = await Biodata.GetBiodataById(id);
      return res.data.data;
    },
    enabled: !!id,   // only runs if id is truthy
  });
};

// ── CREATE ───────────────────────────────────────────────────────────────────
export const useCreateBiodata = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: Biodata.CreateBiodata,
    onSuccess: () => {
      // Invalidate the list so Dashboard re-fetches automatically
      queryClient.invalidateQueries({ queryKey: [BIODATA_KEY] });
      console.log("Create Biodata Success");
    },
    onError: (error) => {
      console.log("Create Biodata Error", error);
    },
  });
};

// ── UPDATE ───────────────────────────────────────────────────────────────────
export const useUpdateBiodata = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: Biodata.UpdateBiodata,   // receives { id, data }
    onSuccess: (res) => {
      const updated = res.data.data;
      // Invalidate both the list and this specific item's cache
      queryClient.invalidateQueries({ queryKey: [BIODATA_KEY] });
      queryClient.invalidateQueries({ queryKey: [BIODATA_KEY, updated._id] });
      console.log("Update Biodata Success");
    },
    onError: (error) => {
      console.log("Update Biodata Error", error);
    },
  });
};

// ── DELETE ───────────────────────────────────────────────────────────────────
export const useDeleteBiodata = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: Biodata.DeleteBiodata,   // receives id
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BIODATA_KEY] });
      console.log("Delete Biodata Success");
    },
    onError: (error) => {
      console.log("Delete Biodata Error", error);
    },
  });
};

// ── UPDATE TEMPLATE ──────────────────────────────────────────────────────────
export const useUpdateTemplateBiodata = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: Biodata.UpdateTemplateBiodata,  // receives { id, data }
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BIODATA_KEY] });
      console.log("Update Template Biodata Success");
    },
    onError: (error) => {
      console.log("Update Template Biodata Error", error);
    },
  });
};