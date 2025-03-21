import z from 'zod';

export const PrescriptionSchema = z.object({
    "file": z.string().refine((val) => {
            try {
                const base64Pattern = /^data:image\/[a-zA-Z]+;base64,/;
                return base64Pattern.test(val) && btoa(atob(val.split(',')[1])) === val.split(',')[1];
            } catch (e) {
                return false;
            }
        }, {
            message: "Invalid base64 string"
        })
})