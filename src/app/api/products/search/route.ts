import { z } from "zod";
import type {NextRequest} from 'next/server'
import data from '../data.json'

export async function GET(request: NextRequest,
) {

    const { searchParams } = request.nextUrl

    const query = z.string().parse(searchParams.get('q'))

    const products = data.products.filter(product => product.title.toLocaleLowerCase().includes(query.toLowerCase()))

    return Response.json(products)
}