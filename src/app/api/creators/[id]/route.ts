export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mockCreators: { [key: string]: any } = {
      'creator-1': {
        id: 'creator-1',
        name: 'SneakerKing',
      },
      'creator-2': {
        id: 'creator-2',
        name: 'VintageVibes',
      },
      'creator-3': {
        id: 'creator-3',
        name: 'ArtCollector',
      },
    };

    const creator = mockCreators[params.id];

    if (!creator) {
      return Response.json(
        { error: 'Creator not found' },
        { status: 404 }
      );
    }

    return Response.json(creator);
  } catch (error) {
    console.error('Error fetching creator:', error);
    return Response.json(
      { error: 'Failed to fetch creator' },
      { status: 500 }
    );
  }
}
