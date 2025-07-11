interface DiffViewerProps {
  diffContent: string;
  fileName?: string;
  onClose: () => void;
  className?: string;
}

export default function DiffViewer({ 
  diffContent, 
  fileName = 'File', 
  onClose, 
  className = '' 
}: DiffViewerProps) {

  return (
    <div className={`
      flex flex-col h-full
      bg-[#1E1E1E] rounded-[21px] 
      border border-[#232323]
      overflow-hidden
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#232323]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              <polyline points="16,8 12,12 8,8"/>
              <polyline points="8,16 12,12 16,16"/>
            </svg>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-[#E5F0FF] text-[#005AD9] rounded-full text-xs font-semibold">
                1
              </div>
              <span className="text-white font-semibold text-sm">Diff viewer</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-[#878787] hover:text-white transition-colors p-1"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#232323]" />

      {/* File Info */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">{fileName}</span>
            <span className="text-[#878787] text-xs">index changes: 355 +345 size</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-1 text-[#F84752] hover:bg-[#F84752]/10 rounded text-sm font-semibold transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.2"/>
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Deny all
          </button>
          
          <button className="flex items-center gap-1 px-3 py-1 text-[#00BD46] hover:bg-[#00BD46]/10 rounded text-sm font-semibold transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="8" fill="currentColor" opacity="0.2"/>
              <path d="M6 10l2 2 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Approve all
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#232323]" />

      {/* Diff Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          {/* Change Header */}
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#D3040E] rounded-full" />
                <div className="w-2 h-2 bg-[#00D64F] rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-xs">Changed import statements</span>
                <span className="text-[#666666] text-xs">index changes: 355 +345 size</span>
              </div>
            </div>
          </div>

          {/* Code Section */}
          <div className="mx-4 mb-4">
            {/* Section Header */}
            <div className="bg-[#232323] px-4 py-2 rounded-t-md border-b border-[#232323]">
              <div className="flex items-center justify-between">
                <span className="text-[#878787] text-xs">Output</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#595959]">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Code Content */}
            <div className="bg-black rounded-b-md p-4 relative">
              <button className="absolute top-2 right-2 text-[#878787] hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm4 3a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V7H6a1 1 0 1 1 0-2h2z"/>
                </svg>
              </button>
              
              <pre className="text-[#C05CFF] text-xs font-mono leading-5 overflow-x-auto whitespace-pre-wrap">
                {diffContent || `import json
import boto3
from datetime import datetime

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('CheesePuffs')

def lambda_handler(event, context):
    try:
        # Parse the incoming event body
        if 'body' in event:
            body = json.loads(event['body'])
        else:
            body = event
        
        # Required fields
        puff_id = body.get('puff_id')
        flavor = body.get('flavor')
        
        if not puff_id or not flavor:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'message': 'Missing required fields: puff_id and flavor are required'
                })
            }
        
        # Create item with timestamp
        item = {
            'puff_id': puff_id,
            'flavor': flavor,
            'created_at': datetime.utcnow().isoformat(),
            'description': body.get('description', ''),
            'price': body.get('price', 0.0),
            'in_stock': body.get('in_stock', True)
        }
        
        # Put item in DynamoDB
        table.put_item(Item=item)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Cheese puff created successfully',
                'item': item
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error creating cheese puff: {str(e)}'
            })
        }`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
