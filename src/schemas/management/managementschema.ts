import { z } from "zod";

export const citySchema = z.object({
    city: z.string().min(1, { message: "City name is required." }).max(255, { message: "City name must be at most 255 characters long." }),
});

export const localitySchema = z.object({
    area: z.string().min(1, "Area name is required").max(255, "Area name must be at most 255 characters long"),
    city_id: z.number().int("City ID must be an integer").positive("City ID must be a positive number").nonnegative("City ID must be a non-negative number"),
});

export const projectSchema = z.object({
    project_name: z.string().min(1, "Project name is required").max(255, "Project name must be at most 255 characters long"),
    cost_configuration_id: z
        .number()
        .int("Cost Configuration ID must be an integer")
        .positive("Cost Configuration ID must be a positive number").optional(),
    is_wing: z.boolean().optional(),
    locality_id: z.number().int("Locality ID must be an integer").positive("Locality ID must be a positive number"),
});

export const editProjectSchema = z.object({
    project_name: z.string().min(1, "Project name is required").max(255, "Project name must be at most 255 characters long").optional(),
    locality_id: z.number().int("Locality ID must be an integer").positive("Locality ID must be a positive number"),
    cost_configuration_id: z
        .number()
        .int("Cost Configuration ID must be an integer")
        .positive("Cost Configuration ID must be a positive number"),
    is_wing: z.boolean().optional(),
});

export const towerSchema = z.object({
    tower_name: z.string().min(1, "Tower name is required").max(255, "Tower name must be at most 255 characters long"),
    project_id: z.number().int("Project ID must be an integer").positive("Project ID must be a positive number"),
});

export const editTowerSchema = z.object({
    tower_name: z.string().min(1, "Tower name is required").max(255, "Tower name must be at most 255 characters long").optional(),
    project_id: z.number().int("Project ID must be an integer").positive("Project ID must be a positive number"),
});

export const wingSchema = z.object({
    name: z.string().min(1, "Wing name is required").max(255, "Wing name must be at most 255 characters long"),
    tower_id: z.number().int("Tower ID must be an integer").positive("Tower ID must be a positive number"),
});

export const editWingSchema = z.object({
    name: z.string().min(1, "Wing name is required").max(255, "Wing name must be at most 255 characters long").optional(),
});

export const floorSchema = z.object({
    name: z.string().min(1, "Floor name is required").max(255, "Floor name must be at most 255 characters long"),
    wing_id: z.number().int("Wing ID must be an integer").positive("Wing ID must be a positive number"),
});

export const flatSchema = z.object({
    flat_no: z.string().min(1, "Flat number is required").max(255, "Flat number must be at most 255 characters long"),
    floor_id: z.number().int("Floor ID must be an integer").positive("Floor ID must be a positive number"),
    meter_id: z.number().int().positive("Meter ID must be a positive number").optional(), // Optional if not assigned
    address: z.string().min(1, "Address is required").max(255, "Address must be at most 255 characters long"),
});

export const editFlatSchema = z.object({
    flat_no: z.string().min(1, "Flat number is required").max(255, "Flat number must be at most 255 characters long"),
    floor_id: z.number().int("Floor ID must be an integer").positive("Floor ID must be a positive number"),
    meter_id: z.number().int().positive("Meter ID must be a positive number").optional(), // Optional if not assigned
    address: z.string().min(1, "Address is required").max(255, "Address must be at most 255 characters long"),
});


