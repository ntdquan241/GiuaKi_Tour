export interface Tour {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string;
  image: string;
  isFavorite: boolean;
}

// Nhóm tour theo thành phố, sắp xếp thành phố A-Z và tour theo ngày khởi hành tăng dần
export function groupByCity(tours: Tour[]) {
  const grouped: { [key: string]: Tour[] } = {};
  
  tours.forEach(tour => {
    const city = tour.city || 'Khác';
    if (!grouped[city]) {
      grouped[city] = [];
    }
    grouped[city].push(tour);
  });

  const result = Object.keys(grouped).map(city => {
    const sortedData = grouped[city].sort((a, b) => a.departure.localeCompare(b.departure));
    return {
      title: `${city} · ${sortedData.length} tour`,
      data: sortedData,
      cityName: city,
    };
  });

  return result.sort((a, b) => a.cityName.localeCompare(b.cityName));
}

// Định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

// Nhãn số chỗ theo yêu cầu biên (0, 1-3, >3)
export function getSeatLabel(seats: number): string {
  if (seats === 0) return "Hết chỗ";
  if (seats >= 1 && seats <= 3) return `Chỉ còn ${seats} chỗ`;
  return `Còn ${seats} chỗ`;
}