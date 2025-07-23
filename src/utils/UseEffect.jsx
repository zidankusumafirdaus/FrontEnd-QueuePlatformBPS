import React, { useEffect } from "react";

// Importing from service, utils & components
import { getAllGuests } from "../../service/api/api";

const [setLoading] = useState(true);
const [setError] = useState(null);

useEffect(() => {
    export const fetchGuests = async () => {
        try {
        const response = await getAllGuests();
        setGuests(response.data);
        } catch (err) {
        console.error("Error fetching guests:", err);
        setError("Gagal memuat data tamu. Silakan coba lagi.");
        } finally {
        setLoading(false);
        }
    };

    fetchGuests();
}, []);