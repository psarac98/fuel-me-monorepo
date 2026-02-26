# API — CLAUDE.md

Backend-specific guidance for `apps/api` (NestJS 11).

## Commands

```bash
pnpm --filter api dev              # Start with --watch (port 4000)
pnpm --filter api build            # Compile to dist/
pnpm --filter api start            # Run compiled output
```

## Module Structure

Each feature module follows this structure:

```
src/<module>/
├── <module>.module.ts          # NestJS module definition
├── <module>.controller.ts      # HTTP endpoints
├── <module>.service.ts         # Business logic
├── <module>.validator.ts       # Optional: database-level validation
├── <entity>.entity.ts          # TypeORM entity
├── <enum>.enum.ts              # Enums (if needed)
└── dto/
    ├── index.ts                # Barrel export
    ├── create-<entity>.dto.ts  # Create DTO (class-validator)
    ├── update-<entity>.dto.ts  # Update DTO (all fields optional)
    └── <entity>-response.dto.ts # Response DTO (@ApiProperty on every field)
```

## Entity Pattern

All entities extend `BaseEntity` from `src/common/base.entity.ts` which provides:
- `id` — UUID v4, auto-generated
- `createdAt` — auto-set timestamp
- `updatedAt` — auto-updated timestamp

```typescript
@Entity("table_name")
export class MyEntity extends BaseEntity {
  @Column({ unique: true })
  email!: string;
}
```

## DTO Pattern

- **Create DTOs**: all fields required, validated with `class-validator` decorators (`@IsEmail()`, `@IsString()`, `@IsEnum()`, etc.)
- **Update DTOs**: all fields optional with `@IsOptional()` on each
- **Response DTOs**: `@ApiProperty()` on every field (including enum fields with `{ enum: EnumName }`) — this drives the OpenAPI schema generation

## Controller Pattern

```typescript
@ApiTags("ModuleName")
@Controller("route")
export class MyController {
  @Get()
  @ApiOperation({ operationId: "getItems", summary: "Descriptive summary of what this endpoint does" })
  findAll() {}

  @Post()
  @ApiOperation({ operationId: "createItem", summary: "Create a new item" })
  @ApiResponse({ status: 409, description: "Item already exists" })
  create(@Body() dto: CreateItemDto) {}

  @Patch(":id")
  @ApiOperation({ operationId: "updateItem", summary: "Update an existing item" })
  @ApiResponse({ status: 404, description: "Item not found" })
  @ApiResponse({ status: 409, description: "Duplicate value" })
  update(@Param("id") id: string, @Body() dto: UpdateItemDto) {}
}
```

Every endpoint needs:
- `@ApiOperation` with unique `operationId` and descriptive `summary`
- `@ApiResponse` for every non-2xx status it can return

## Validator Pattern

Optional per module. Handles database-level checks before service logic runs.

```typescript
@Injectable()
export class MyValidator {
  constructor(
    @InjectRepository(MyEntity)
    private readonly repo: Repository<MyEntity>,
  ) {}

  async validateCreate(dto: CreateDto): Promise<void> {
    // Check uniqueness, referential integrity, etc.
    // Throw ConflictException, BadRequestException, etc.
  }
}
```

Services inject the validator and call it at the start of create/update methods.

## Service Pattern

- Inject repository via `@InjectRepository(Entity)`
- Inject validator (if exists) as a second constructor parameter
- Use `findOneBy()` for single lookups, `find()` for lists
- Throw `NotFoundException` when entity not found
- Use `create()` + `save()` for inserts, `Object.assign()` + `save()` for updates

## Global Configuration (main.ts)

- `helmet()` — security headers
- `ValidationPipe` — whitelist, forbidNonWhitelisted, transform
- CORS — localhost:3000 and :3001
- API prefix — `/api`
- Swagger — at `/docs`, JSON at `/docs-json`
- ThrottlerGuard — 60 req/60s (configured in AppModule)

## Data Source

- PostgreSQL connection configured in `src/data-source.ts`
- Reads from env vars: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`
- `synchronize: false` — always use migrations
- New entities must be added to the `entities` array in `data-source.ts`
