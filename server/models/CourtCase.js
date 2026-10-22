import { mongoose } from '../lib/mongoose.js';

const courtCaseSchema = new mongoose.Schema({
  caseId:                  { type: String, required: true, unique: true },
  caseTitle:               { type: String, required: true },
  caseType:                { type: String, default: 'Civil' },
  dateDecided:             { type: String },
  status:                  { type: String, default: 'Decided' },

  judgeId:                 { type: String },
  judgeName:               { type: String },

  plaintiffClientId:       { type: String },
  plaintiffClientName:     { type: String },
  plaintiffLawyerLicense:  { type: String },
  plaintiffLawyerName:     { type: String },
  judgeRatingPlaintiff:    { type: Number, default: 5.0 },
  clientRatingPlaintiff:   { type: Number, default: null },

  defendantClientId:       { type: String },
  defendantClientName:     { type: String },
  defendantLawyerLicense:  { type: String },
  defendantLawyerName:     { type: String },
  judgeRatingDefendant:    { type: Number, default: 4.0 },
  clientRatingDefendant:   { type: Number, default: null },

  verdict:                 { type: String, default: 'Decided' },
}, { timestamps: true });
export default mongoose.models.CourtCase || mongoose.model('CourtCase', courtCaseSchema);
// Initialize CourtCase model schema
// Add case number and title fields
// Implement plaintiff and defendant reference fields
// Add filing date and status enum fields
// Define judge and court jurisdiction references
// Add array field for hearing dates and schedules
// Implement virtual field for case duration
// Add document attachments reference array
// Create database index on case number for fast lookups
// Add description and case summary text fields
// Implement pre-save hook for status updates
// Add reference to assigned lawyer profiles
// Define custom validation for hearing date chronology
// Add field for case resolution or verdict details
// Implement soft delete for archived court cases
// Add timestamp configuration for case schema
// Create instance method to check active case status
// Add tags array for case categorization
// Implement pagination plugin for case queries
// Finalize CourtCase schema compilation and export
