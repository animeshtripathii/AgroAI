import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ArrowUpDown, Filter } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface MarketData {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    arrival_date: string;
    min_price: string;
    max_price: string;
    modal_price: string;
}

/* STATIC STATES */
const ALL_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir",
    "Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
    "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim",
    "Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];

const MarketRates = () => {
    const [data, setData] = useState<MarketData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [stateFilter, setStateFilter] = useState("");

    const toTitleCase = (str: string) =>
        str.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());

    /* --------------------------------------------------
       FETCH DATA (STATE ONLY, LIMIT=100)
    ---------------------------------------------------*/
    const fetchData = async () => {
        if (!stateFilter) {
            toast.error("Please select a State.");
            return;
        }

        try {
            setIsLoading(true);

            const baseUrl = import.meta.env.VITE_MARKET_RATES_API_URL;
            const apiKey = import.meta.env.VITE_MARKET_RATES_API_KEY;

            const params = new URLSearchParams();
            params.append("api-key", apiKey);
            params.append("format", "json");
            params.append("limit", "100");

            // only state filter now
            params.append("filters[state]", toTitleCase(stateFilter));

            const url = `${baseUrl}?${params.toString()}`;
            console.log("Fetch URL:", url);

            const res = await axios.get(url);
            const records = res.data.records || [];

            setData(records);

            if (records.length === 0) {
                toast.info("No records found for this state.");
            } else {
                toast.success(`Found ${records.length} records.`);
            }

        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to fetch market rates.");
        } finally {
            setIsLoading(false);
        }
    };

    const [sortConfig, setSortConfig] =
        useState<{ key: keyof MarketData; direction: "asc" | "desc" } | null>(null);

    const handleSort = (key: keyof MarketData) => {
        const direction =
            sortConfig && sortConfig.key === key && sortConfig.direction === "asc"
                ? "desc"
                : "asc";

        setSortConfig({ key, direction });

        const sorted = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setData(sorted);
    };

    /* --------------------------------------------------
       UI
    ---------------------------------------------------*/
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                
                {/* Filters */}
                <Card className="border-none shadow-sm bg-white mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Search Filters
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4 items-end">

                            {/* STATE DROPDOWN */}
                            <div className="w-full md:w-1/3">
                                <label className="text-sm font-medium">State</label>
                                <select
                                    className="w-full border rounded-md p-2 text-sm"
                                    value={stateFilter}
                                    onChange={(e) => setStateFilter(e.target.value)}
                                >
                                    <option value="">Select State</option>
                                    {ALL_STATES.map((st, i) => (
                                        <option key={i} value={st}>
                                            {st}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* BUTTON */}
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={fetchData}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Search className="w-4 h-4 mr-2" />
                                )}
                                Get Rates
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Price List</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-12">Fetching data…</div>
                        ) : data.length > 0 ? (
                            <div className="rounded-md border overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead onClick={() => handleSort("state")}>
                                                State <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                            </TableHead>
                                            <TableHead onClick={() => handleSort("district")}>
                                                District <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                            </TableHead>
                                            <TableHead onClick={() => handleSort("market")}>
                                                Market <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                            </TableHead>
                                            <TableHead onClick={() => handleSort("commodity")}>
                                                Commodity <ArrowUpDown className="inline w-3 h-3 ml-1" />
                                            </TableHead>
                                            <TableHead>Variety</TableHead>
                                            <TableHead>Arrival Date</TableHead>
                                            <TableHead>Min</TableHead>
                                            <TableHead>Max</TableHead>
                                            <TableHead>Modal</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {data.map((row, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{row.state}</TableCell>
                                                <TableCell>{row.district}</TableCell>
                                                <TableCell>{row.market}</TableCell>
                                                <TableCell>{row.commodity}</TableCell>
                                                <TableCell>{row.variety}</TableCell>
                                                <TableCell>{row.arrival_date}</TableCell>
                                                <TableCell>{row.min_price}</TableCell>
                                                <TableCell>{row.max_price}</TableCell>
                                                <TableCell>{row.modal_price}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                Select state to view mandi data.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MarketRates;
