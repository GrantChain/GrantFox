import { useQuery } from "@tanstack/react-query";
import { grantsService } from "../services/grants.service";

export const useGrants = () => {
  return useQuery({
    queryKey: ["grants"],
    queryFn: () => grantsService.findAll(),
  });
};
