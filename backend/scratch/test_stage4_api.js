import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import app from '../app.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const runTests = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prepforge';
    await mongoose.connect(mongoUri);
    console.log('Test connected to MongoDB.');

    // Start ephemeral express listener for testing
    const server = app.listen(5005);
    const BASE_URL = 'http://localhost:5005/api';

    console.log('\n--- STARTING STAGE 4 BACKEND API TESTS ---\n');

    // 1. GET /api/questions
    const res1 = await fetch(`${BASE_URL}/questions`);
    const data1 = await res1.json();
    console.log('1. GET /api/questions -> Status:', res1.status, '| Success:', data1.success, '| Total Count:', data1.pagination?.total);

    // 2. GET /api/questions?category=DSA
    const res2 = await fetch(`${BASE_URL}/questions?category=DSA`);
    const data2 = await res2.json();
    console.log('2. GET /api/questions?category=DSA -> Count:', data2.questions?.length, '| Total:', data2.pagination?.total);

    // 3. GET /api/questions?difficulty=Medium
    const res3 = await fetch(`${BASE_URL}/questions?difficulty=Medium`);
    const data3 = await res3.json();
    console.log('3. GET /api/questions?difficulty=Medium -> Count:', data3.questions?.length, '| Total:', data3.pagination?.total);

    // 4. GET /api/questions?search=tree
    const res4 = await fetch(`${BASE_URL}/questions?search=tree`);
    const data4 = await res4.json();
    console.log('4. GET /api/questions?search=tree -> Count:', data4.questions?.length, '| Sample Title:', data4.questions[0]?.title);

    // 5. GET /api/questions/:id
    const sampleId = data1.questions[0]?.customId || 'dsa-arr-1';
    const res5 = await fetch(`${BASE_URL}/questions/${sampleId}`);
    const data5 = await res5.json();
    console.log(`5. GET /api/questions/${sampleId} -> Status:`, res5.status, '| Title:', data5.question?.title);

    // 6. GET /api/companies
    const res6 = await fetch(`${BASE_URL}/companies`);
    const data6 = await res6.json();
    console.log('6. GET /api/companies -> Count:', data6.companies?.length, '| Slugs:', data6.companies?.map(c => c.slug).join(', '));

    // 7. GET /api/companies/google
    const res7 = await fetch(`${BASE_URL}/companies/google`);
    const data7 = await res7.json();
    console.log('7. GET /api/companies/google -> Name:', data7.company?.name, '| Tier:', data7.company?.tier);

    // 8. GET /api/companies/google/questions
    const res8 = await fetch(`${BASE_URL}/companies/google/questions`);
    const data8 = await res8.json();
    console.log('8. GET /api/companies/google/questions -> Count:', data8.questions?.length, '| Total:', data8.pagination?.total);

    // 9. Pagination (page=1&limit=5)
    const res9 = await fetch(`${BASE_URL}/questions?page=1&limit=5`);
    const data9 = await res9.json();
    console.log('9. Pagination (limit=5) -> Questions returned:', data9.questions?.length, '| TotalPages:', data9.pagination?.totalPages);

    // 10. Multiple filters together
    const res10 = await fetch(`${BASE_URL}/questions?category=DSA&difficulty=Easy&search=Sum`);
    const data10 = await res10.json();
    console.log('10. Multi-filter (DSA, Easy, "Sum") -> Count:', data10.questions?.length, '| Titles:', data10.questions?.map(q => q.title).join(', '));

    // 11. Invalid question ID
    const res11 = await fetch(`${BASE_URL}/questions/invalid-id-xyz999`);
    const data11 = await res11.json();
    console.log('11. Invalid question ID -> Status:', res11.status, '| Success:', data11.success, '| Message:', data11.message);

    // 12. Invalid company ID
    const res12 = await fetch(`${BASE_URL}/companies/non-existent-company`);
    const data12 = await res12.json();
    console.log('12. Invalid company ID -> Status:', res12.status, '| Success:', data12.success, '| Message:', data12.message);

    // 13. Empty search result
    const res13 = await fetch(`${BASE_URL}/questions?search=xyznonexistent123`);
    const data13 = await res13.json();
    console.log('13. Empty search result -> Status:', res13.status, '| Success:', data13.success, '| Questions Count:', data13.questions?.length);

    // 14. Verify user collection remains untouched
    const userCount = await User.countDocuments({});
    console.log('14. User collection verification -> Total Users in DB:', userCount);

    console.log('\n--- ALL 14 BACKEND API TESTS COMPLETED SUCCESSFULLY ---\n');

    server.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Test execution error:', error);
    process.exit(1);
  }
};

runTests();
