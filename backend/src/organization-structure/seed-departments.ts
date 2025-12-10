/**
 * Seed script to insert sample departments
 * Run with: npm run build && node dist/organization-structure/seed-departments.js
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';

async function seedDepartments() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const Department = app.get(getModelToken('Department'));

    console.log('\n' + '='.repeat(50));
    console.log('🏢 DEPARTMENT SEEDER');
    console.log('='.repeat(50));

    const departments = [
        { code: 'ENG', name: 'Engineering', description: 'Software development and engineering team' },
        { code: 'FIN', name: 'Finance', description: 'Financial operations and accounting' },
        { code: 'SALES', name: 'Sales', description: 'Sales and business development' },
        { code: 'MKT', name: 'Marketing', description: 'Marketing and brand management' },
        { code: 'IT', name: 'Information Technology', description: 'IT infrastructure and support' },
        { code: 'OPS', name: 'Operations', description: 'Business operations and logistics' },
        { code: 'LEGAL', name: 'Legal', description: 'Legal and compliance' },
        { code: 'CS', name: 'Customer Support', description: 'Customer service and support' },
        { code: 'RD', name: 'Research & Development', description: 'Innovation and product research' },
        { code: 'ADMIN', name: 'Administration', description: 'General administration' },
    ];

    let created = 0;
    let skipped = 0;

    for (const dept of departments) {
        const existing = await Department.findOne({ code: dept.code });
        if (existing) {
            console.log(`⏩ Skipping ${dept.name} (already exists)`);
            skipped++;
            continue;
        }

        await Department.create({
            code: dept.code,
            name: dept.name,
            description: dept.description,
            isActive: true,
        });
        console.log(`✅ Created: ${dept.name}`);
        created++;
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Created: ${created}`);
    console.log(`⏩ Skipped: ${skipped}`);

    const total = await Department.countDocuments({});
    console.log(`📁 Total departments in DB: ${total}`);

    await app.close();
    console.log('\n✅ Done!\n');
}

seedDepartments().catch(console.error);
