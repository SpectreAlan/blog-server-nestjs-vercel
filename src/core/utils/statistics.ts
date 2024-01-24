export const statistics = async (entity, start, end, type) => {
  const startDate = new Date(start);
  const endDate = new Date(end + ' 23:59:59.999');
  const data =
    type === 'day'
      ? await statisticsByDay(entity, startDate, endDate)
      : await statisticsByMonth(entity, startDate, endDate);
  return { data };
};
export const statisticsByMonth = async (entity, start, end) => {
  const data = await entity.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: 1,
          },
        },
        count: 1,
      },
    },
    {
      $project: {
        month: { $dateToString: { format: '%Y-%m', date: '$month' } },
        count: 1,
      },
    },
  ]);
  return getMonthEchartsOption(start, end, data);
};
export const statisticsByDay = async (entity, start, end) => {
  const data = await entity.aggregate([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lte: end,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        day: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
        },
        count: 1,
      },
    },
    {
      $project: {
        day: { $dateToString: { format: '%Y-%m-%d', date: '$day' } },
        count: 1,
      },
    },
  ]);
  return getDaysEchartsOption(start, end, data);
};
export const getMonthEchartsOption = (start, end, data) => {
  const xAxis = [];
  const series = [];
  const o = {};
  data.map(({ count, month }) => (o[month] = count));

  while (start <= end) {
    const year = start.getFullYear();
    const month = start.getMonth() + 1;
    const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
    xAxis.push(formattedMonth);
    series.push(o[formattedMonth] || 0);

    start.setMonth(start.getMonth() + 1);
  }
  return {
    xAxis,
    series,
  };
};
export const getDaysEchartsOption = (start, end, data) => {
  const xAxis = [];
  const series = [];
  const o = {};
  data.map(({ count, day }) => (o[day] = count));

  while (start <= end) {
    const day = start.toISOString().split('T')[0];
    xAxis.push(day);
    start.setDate(start.getDate() + 1);
    series.push(o[day] || 0);
  }
  return {
    xAxis,
    series,
  };
};
