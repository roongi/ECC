/**
 * Tests for bbos/skill-register-template.json schema validation
 *
 * Run with: node tests/bbos/skill-register-template.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');

const TEMPLATE_PATH = path.join(__dirname, '..', '..', 'bbos', 'skill-register-template.json');

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing bbos/skill-register-template.json ===\n');

  let passed = 0;
  let failed = 0;

  console.log('File Existence:');

  if (test('template file exists', () => {
    assert.ok(fs.existsSync(TEMPLATE_PATH), `Template not found at ${TEMPLATE_PATH}`);
  })) passed++; else failed++;

  let schema;

  console.log('\nJSON Validity:');

  if (test('template is valid JSON', () => {
    const content = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    schema = JSON.parse(content);
    assert.ok(schema, 'Parsed schema should be truthy');
  })) passed++; else failed++;

  if (!schema) {
    console.log('\n⚠ Skipping schema structure tests due to JSON parse failure\n');
    console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
    return failed > 0 ? 1 : 0;
  }

  console.log('\nSchema Structure:');

  if (test('has $schema property', () => {
    assert.ok(schema.$schema, 'Should have $schema property');
    assert.ok(schema.$schema.includes('json-schema.org'), 'Should reference JSON Schema');
  })) passed++; else failed++;

  if (test('has $id property', () => {
    assert.ok(schema.$id, 'Should have $id property');
    assert.ok(schema.$id.includes('skill-register-template'), 'ID should reference template');
  })) passed++; else failed++;

  if (test('has title and description', () => {
    assert.ok(schema.title, 'Should have title');
    assert.ok(schema.description, 'Should have description');
    assert.ok(schema.title.includes('BBOS'), 'Title should mention BBOS');
  })) passed++; else failed++;

  if (test('type is object', () => {
    assert.strictEqual(schema.type, 'object');
  })) passed++; else failed++;

  console.log('\nRequired Properties:');

  if (test('has required array', () => {
    assert.ok(Array.isArray(schema.required), 'Should have required array');
  })) passed++; else failed++;

  if (test('schema_version is required', () => {
    assert.ok(schema.required.includes('schema_version'), 'schema_version should be required');
  })) passed++; else failed++;

  if (test('federation_id is required', () => {
    assert.ok(schema.required.includes('federation_id'), 'federation_id should be required');
  })) passed++; else failed++;

  if (test('skills is required', () => {
    assert.ok(schema.required.includes('skills'), 'skills should be required');
  })) passed++; else failed++;

  console.log('\nProperties Definitions:');

  if (test('has properties object', () => {
    assert.ok(schema.properties, 'Should have properties object');
    assert.strictEqual(typeof schema.properties, 'object');
  })) passed++; else failed++;

  if (test('schema_version is defined as const', () => {
    const prop = schema.properties.schema_version;
    assert.ok(prop, 'schema_version should be defined');
    assert.strictEqual(prop.const, '1.0.0', 'schema_version should be 1.0.0');
  })) passed++; else failed++;

  if (test('federation_id has pattern validation', () => {
    const prop = schema.properties.federation_id;
    assert.ok(prop, 'federation_id should be defined');
    assert.ok(prop.pattern, 'federation_id should have pattern');
    assert.ok(prop.pattern.includes('[a-z]'), 'Pattern should require lowercase');
  })) passed++; else failed++;

  if (test('skills is defined as array', () => {
    const prop = schema.properties.skills;
    assert.ok(prop, 'skills should be defined');
    assert.strictEqual(prop.type, 'array', 'skills should be array type');
    assert.ok(prop.items, 'skills should have items definition');
  })) passed++; else failed++;

  console.log('\nSkill Item Schema:');

  const skillItemSchema = schema.properties?.skills?.items;

  if (test('skill item has required fields', () => {
    assert.ok(skillItemSchema, 'Skill items should be defined');
    assert.ok(Array.isArray(skillItemSchema.required), 'Should have required array');
    assert.ok(skillItemSchema.required.includes('id'), 'id should be required');
    assert.ok(skillItemSchema.required.includes('name'), 'name should be required');
    assert.ok(skillItemSchema.required.includes('source'), 'source should be required');
  })) passed++; else failed++;

  if (test('skill item has expected properties', () => {
    const props = skillItemSchema.properties;
    assert.ok(props.id, 'Should have id property');
    assert.ok(props.name, 'Should have name property');
    assert.ok(props.description, 'Should have description property');
    assert.ok(props.source, 'Should have source property');
    assert.ok(props.targets, 'Should have targets property');
    assert.ok(props.activation, 'Should have activation property');
    assert.ok(props.dependencies, 'Should have dependencies property');
    assert.ok(props.metadata, 'Should have metadata property');
  })) passed++; else failed++;

  if (test('skill source has type enum', () => {
    const sourceProps = skillItemSchema.properties?.source?.properties;
    assert.ok(sourceProps, 'source should have properties');
    assert.ok(sourceProps.type, 'source should have type');
    assert.ok(Array.isArray(sourceProps.type.enum), 'type should have enum');
    assert.ok(sourceProps.type.enum.includes('local'), 'Should support local');
    assert.ok(sourceProps.type.enum.includes('remote'), 'Should support remote');
    assert.ok(sourceProps.type.enum.includes('inline'), 'Should support inline');
  })) passed++; else failed++;

  if (test('skill targets include expected harnesses', () => {
    const targetsSchema = skillItemSchema.properties?.targets;
    assert.ok(targetsSchema, 'targets should be defined');
    const itemsEnum = targetsSchema.items?.enum;
    assert.ok(Array.isArray(itemsEnum), 'targets items should have enum');
    assert.ok(itemsEnum.includes('claude'), 'Should support claude');
    assert.ok(itemsEnum.includes('cursor'), 'Should support cursor');
    assert.ok(itemsEnum.includes('hermes'), 'Should support hermes');
    assert.ok(itemsEnum.includes('all'), 'Should support all');
  })) passed++; else failed++;

  console.log('\nOptional Properties:');

  if (test('organization is optional', () => {
    assert.ok(!schema.required.includes('organization'), 'organization should not be required');
    assert.ok(schema.properties.organization, 'organization should be defined');
  })) passed++; else failed++;

  if (test('agents is optional', () => {
    assert.ok(!schema.required.includes('agents'), 'agents should not be required');
    assert.ok(schema.properties.agents, 'agents should be defined');
  })) passed++; else failed++;

  if (test('memory_bridge is optional', () => {
    assert.ok(!schema.required.includes('memory_bridge'), 'memory_bridge should not be required');
    assert.ok(schema.properties.memory_bridge, 'memory_bridge should be defined');
  })) passed++; else failed++;

  if (test('governance is optional', () => {
    assert.ok(!schema.required.includes('governance'), 'governance should not be required');
    assert.ok(schema.properties.governance, 'governance should be defined');
  })) passed++; else failed++;

  console.log('\nExamples Validation:');

  if (test('has examples array', () => {
    assert.ok(Array.isArray(schema.examples), 'Should have examples array');
    assert.ok(schema.examples.length > 0, 'Should have at least one example');
  })) passed++; else failed++;

  if (test('example has required fields', () => {
    const example = schema.examples[0];
    assert.ok(example.schema_version, 'Example should have schema_version');
    assert.ok(example.federation_id, 'Example should have federation_id');
    assert.ok(Array.isArray(example.skills), 'Example should have skills array');
  })) passed++; else failed++;

  if (test('example federation_id matches pattern', () => {
    const example = schema.examples[0];
    const pattern = new RegExp(schema.properties.federation_id.pattern);
    assert.ok(pattern.test(example.federation_id), 'Example federation_id should match pattern');
  })) passed++; else failed++;

  if (test('example skill has required fields', () => {
    const skill = schema.examples[0].skills[0];
    assert.ok(skill.id, 'Skill should have id');
    assert.ok(skill.name, 'Skill should have name');
    assert.ok(skill.source, 'Skill should have source');
    assert.ok(skill.source.type, 'Skill source should have type');
  })) passed++; else failed++;

  console.log('\nSecurity Considerations:');

  if (test('additionalProperties is false at root', () => {
    assert.strictEqual(schema.additionalProperties, false, 'Root should not allow additional properties');
  })) passed++; else failed++;

  if (test('skill items do not allow additional properties', () => {
    assert.strictEqual(skillItemSchema.additionalProperties, false, 'Skill items should not allow additional properties');
  })) passed++; else failed++;

  if (test('string lengths are bounded', () => {
    const nameMaxLength = skillItemSchema.properties?.name?.maxLength;
    const descMaxLength = skillItemSchema.properties?.description?.maxLength;
    assert.ok(nameMaxLength && nameMaxLength <= 256, 'name should have bounded length');
    assert.ok(descMaxLength && descMaxLength <= 1024, 'description should have bounded length');
  })) passed++; else failed++;

  console.log('\n' + '='.repeat(50));
  console.log(`Results: Passed: ${passed}, Failed: ${failed}`);
  console.log('='.repeat(50));

  return failed > 0 ? 1 : 0;
}

if (require.main === module) {
  process.exit(runTests());
}

module.exports = { runTests };
